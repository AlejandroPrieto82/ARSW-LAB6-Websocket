package eci.edu.websocket.interactiveblackboard.endpoints;

import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

@Component
@ServerEndpoint("/bbService")
public class BBEndpoint {

    private static final Logger logger = Logger.getLogger(BBEndpoint.class.getName());
    private static final Queue<Session> SESSIONS = new ConcurrentLinkedQueue<>();
    private Session ownSession;

    public void send(String msg) {
        for (Session session : SESSIONS) {
            if (session == null || session.equals(this.ownSession) || !session.isOpen()) {
                continue;
            }
            try {
                session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                logger.log(Level.WARNING, e.toString());
                SESSIONS.remove(session);
            }
        }
        logger.log(Level.INFO, "Broadcasted: {0}", msg);
    }

    @OnMessage
    public void processPoint(String message, Session session) {
        logger.log(Level.INFO, "Point received: {0}", message);
        send(message);
    }

    @OnOpen
    public void openConnection(Session session) {
        SESSIONS.add(session);
        this.ownSession = session;
        logger.log(Level.INFO, "Connection opened.");
        try {
            session.getBasicRemote().sendText("Connection established.");
        } catch (IOException ex) {
            logger.log(Level.SEVERE, null, ex);
        }
    }

    @OnClose
    public void closedConnection(Session session) {
        SESSIONS.remove(session);
        logger.log(Level.INFO, "Connection closed.");
    }

    @OnError
    public void error(Session session, Throwable t) {
        SESSIONS.remove(session);
        logger.log(Level.WARNING, t.toString());
        logger.log(Level.INFO, "Connection error.");
    }
}
