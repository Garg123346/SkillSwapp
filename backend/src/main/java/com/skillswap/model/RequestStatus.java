package com.skillswap.model;

public enum RequestStatus {
    Pending,
    Accepted,
    Rejected,
    Completed,
    Cancelled;

    public static RequestStatus fromString(String text) {
        if (text == null) return Pending;
        for (RequestStatus s : RequestStatus.values()) {
            if (s.name().equalsIgnoreCase(text) ||
                (s == Pending && text.equalsIgnoreCase("En attente")) ||
                (s == Accepted && text.equalsIgnoreCase("Acceptée")) ||
                (s == Rejected && text.equalsIgnoreCase("Refusée")) ||
                (s == Completed && text.equalsIgnoreCase("Terminée"))) {
                return s;
            }
        }
        return Pending;
    }
}
