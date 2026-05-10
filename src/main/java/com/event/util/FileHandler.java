package com.event.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

/**
 * FILE HANDLER UTILITY
 * Handles all file read/write operations for the application.
 * All data is stored as pipe-delimited text files in the /data directory.
 *
 * Text Files:
 *   users.txt        - Member 1 (User data)
 *   organizers.txt   - Member 2 (Seller profiles)
 *   withdrawals.txt  - Member 2 (Withdrawal requests)
 *   events.txt       - Member 3 (Event data)
 *   tickets.txt      - Member 4 (Booking/ticket data)
 *   payments.txt     - Member 4 (Payment records)
 *   commissions.txt  - Member 4 (Commission rates)
 *   reviews.txt      - Member 5 (Event reviews)
 *   admins.txt       - Member 6 (Site settings)
 */
@Component
public class FileHandler {

    @Value("${app.data.directory:data}")
    private String dataDirectory;

    /**
     * Initialize the data directory and all text files on startup.
     */
    @PostConstruct
    public void init() {
        try {
            Path dirPath = Paths.get(dataDirectory);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            // Create all data files if they don't exist
            String[] files = {
                "users.txt",            // Member 1: User data
                "organizers.txt",       // Member 2: Seller profiles
                "withdrawals.txt",      // Member 2: Withdrawal requests
                "events.txt",           // Member 3: Event data
                "tickets.txt",          // Member 4: Booking/ticket data
                "payments.txt",         // Member 4: Payment records
                "commissions.txt",      // Member 4: Commission rates
                "reviews.txt",          // Member 5: Event reviews
                "admins.txt",           // Member 6: Admin accounts
                "categories.txt",       // Member 5: Event categories
                "ticket_types.txt",     // Member 5: Ticket type definitions
                "ticket_pricing.txt",   // Member 5: Dynamic pricing log
                "admin_activity.txt",   // Member 6: Admin audit log
                "review_moderation.txt",// Member 6: Review moderation log
                "availability.txt"      // Member 3: Event seat availability
            };
            for (String file : files) {
                Path filePath = dirPath.resolve(file);
                if (!Files.exists(filePath)) {
                    Files.createFile(filePath);
                }
            }
            System.out.println("[FileHandler] Data directory initialized: " + dirPath.toAbsolutePath());
        } catch (IOException e) {
            System.err.println("Error initializing data files: " + e.getMessage());
        }
    }

    /**
     * READ: Read all lines from a data file.
     */
    public List<String> readAllLines(String fileName) {
        List<String> lines = new ArrayList<>();
        Path filePath = Paths.get(dataDirectory, fileName);
        try {
            if (Files.exists(filePath)) {
                lines = new ArrayList<>(Files.readAllLines(filePath));
                lines.removeIf(line -> line == null || line.trim().isEmpty());
            }
        } catch (IOException e) {
            System.err.println("Error reading file " + fileName + ": " + e.getMessage());
        }
        return lines;
    }

    /**
     * WRITE: Write all lines to a data file (overwrites existing content).
     */
    public void writeAllLines(String fileName, List<String> lines) {
        Path filePath = Paths.get(dataDirectory, fileName);
        try {
            Files.write(filePath, lines, StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            System.err.println("Error writing file " + fileName + ": " + e.getMessage());
        }
    }

    /**
     * CREATE: Append a single line to a data file.
     */
    public void appendLine(String fileName, String line) {
        Path filePath = Paths.get(dataDirectory, fileName);
        try {
            Files.write(filePath, (line + System.lineSeparator()).getBytes(),
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            System.err.println("Error appending to file " + fileName + ": " + e.getMessage());
        }
    }

    /**
     * UPDATE: Update a specific line in a file identified by its ID (first field).
     */
    public boolean updateLine(String fileName, String id, String newLine) {
        List<String> lines = readAllLines(fileName);
        boolean found = false;
        for (int i = 0; i < lines.size(); i++) {
            if (lines.get(i).startsWith(id + "|")) {
                lines.set(i, newLine);
                found = true;
                break;
            }
        }
        if (found) {
            writeAllLines(fileName, lines);
        }
        return found;
    }

    /**
     * DELETE: Delete a line from a file identified by its ID (first field).
     */
    public boolean deleteLine(String fileName, String id) {
        List<String> lines = readAllLines(fileName);
        boolean removed = lines.removeIf(line -> line.startsWith(id + "|"));
        if (removed) {
            writeAllLines(fileName, lines);
        }
        return removed;
    }

    /**
     * FIND: Find a line by ID (first field before the pipe delimiter).
     */
    public String findById(String fileName, String id) {
        List<String> lines = readAllLines(fileName);
        for (String line : lines) {
            if (line.startsWith(id + "|")) {
                return line;
            }
        }
        return null;
    }

    /**
     * Generate a unique ID based on existing entries.
     */
    public String generateId(String fileName, String prefix) {
        List<String> lines = readAllLines(fileName);
        int maxId = 0;
        for (String line : lines) {
            String[] parts = line.split("\\|", 2);
            if (parts.length > 0 && parts[0].startsWith(prefix)) {
                try {
                    int num = Integer.parseInt(parts[0].substring(prefix.length()));
                    if (num > maxId) maxId = num;
                } catch (NumberFormatException ignored) {}
            }
        }
        return prefix + String.format("%03d", maxId + 1);
    }
}
