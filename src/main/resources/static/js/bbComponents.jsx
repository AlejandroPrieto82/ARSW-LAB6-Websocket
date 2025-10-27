const root = ReactDOM.createRoot(document.getElementById("root"));

function BBServiceURL() {
  const host = window.location.host;
  if (host.toString().startsWith("localhost")) {
    return 'ws://' + host + '/bbService';
  }
  return 'wss://' + host + '/bbService';
}

class WSBBChannel {
  constructor(URL, callback) {
    this.URL = URL;
    this.receivef = callback;
    this.wsocket = null;
    this._connect();
  }
  _connect() {
    try {
      this.wsocket = new WebSocket(this.URL);
      this.wsocket.onopen = (evt) => this.onOpen(evt);
      this.wsocket.onmessage = (evt) => this.onMessage(evt);
      this.wsocket.onerror = (evt) => this.onError(evt);
      this.wsocket.onclose = (evt) => this.onClose(evt);
    } catch (e) {
      console.error(e);
    }
  }
  onOpen(evt) {
    console.log("WS onOpen", evt);
  }
  onMessage(evt) {
    if (evt.data && evt.data !== "Connection established.") {
      if (this.receivef) this.receivef(evt.data);
    }
  }
  onError(evt) {
    console.error("WS onError", evt);
  }
  onClose(evt) {
    console.log("WS onClose", evt);
  }
  send(x, y) {
    if (!this.wsocket || this.wsocket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open", this.wsocket && this.wsocket.readyState);
      return;
    }
    this.wsocket.send(JSON.stringify({ x: x, y: y }));
  }
  close() {
    if (this.wsocket) {
      try { this.wsocket.close(); } catch (e) {}
    }
  }
}

function BBCanvas() {
  const [svrStatus, setSvrStatus] = React.useState({ loadingState: 'Loading Canvas...' });
  const comunicationWS = React.useRef(null);
  const myp5 = React.useRef(null);
  const containerId = 'container-canvas';

  const sketchFactory = (drawPoint) => (p) => {
    p.setup = function () {
      const canvas = p.createCanvas(700, 410);
      canvas.parent(containerId);
      p.background(255);
    };
    p.draw = function () {};
    p.mouseDragged = function () {
      p.noStroke();
      p.fill(0);
      p.ellipse(p.mouseX, p.mouseY, 20, 20);
      if (drawPoint) drawPoint(p.mouseX, p.mouseY);
    };
  };

  React.useEffect(() => {
    function drawPoint(x, y) {
      if (myp5.current) {
        myp5.current.noStroke();
        myp5.current.fill(0);
        myp5.current.ellipse(x, y, 20, 20);
      }
    }

    myp5.current = new p5(sketchFactory(drawPoint), containerId);
    setSvrStatus({ loadingState: 'Canvas Loaded' });

    comunicationWS.current = new WSBBChannel(BBServiceURL(), (msg) => {
      try {
        const obj = JSON.parse(msg);
        drawPoint(obj.x, obj.y);
      } catch (e) {
        console.error("Invalid message", msg);
      }
    });

    return () => {
      if (comunicationWS.current) comunicationWS.current.close();
      if (myp5.current && myp5.current.remove) myp5.current.remove();
    };
  }, []);

  return (
    <div>
      <h4>Drawing status: {svrStatus.loadingState}</h4>
      <div id={containerId}></div>
    </div>
  );
}

function Editor({ name }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <hr />
      <div id="toolstatus"></div>
      <hr />
      <div id="container">
        <BBCanvas />
      </div>
      <hr />
      <div id="info"></div>
    </div>
  );
}

root.render(<Editor name="Daniel" />);