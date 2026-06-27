package com.rashmi.portfolio.util;

public class HtmlSanitizer {
    
    /**
     * Sanitizes input strings to prevent HTML and JavaScript injection (stored XSS).
     */
    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }
        
        // Strip any HTML tags
        String sanitized = input.replaceAll("<[^>]*>", "");
        
        // Remove javascript: pseudo-protocol
        sanitized = sanitized.replaceAll("(?i)javascript:", "");
        
        // Remove common inline event handlers
        sanitized = sanitized.replaceAll("(?i)on\\w+\\s*=", "");
        
        return sanitized.trim();
    }
}
