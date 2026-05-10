package com.event;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EVENT TICKET BOOKING SYSTEM - Main Application Entry Point
 * 
 * Uses FILE HANDLING (.txt files) instead of a database.
 * Data is stored in the /data directory.
 * 
 * @SpringBootApplication with scanBasePackages ensures all beans across
 * the 6 member packages are discovered:
 *   - com.event.user       (Member 1: User Management)
 *   - com.event.eventcore  (Member 2: Event Management)
 *   - com.event.booking    (Member 3: Booking & Reservation)
 *   - com.event.admin      (Member 4: Admin & System)
 *   - com.event.category   (Member 5: Category & Ticket Types)
 *   - com.event.review     (Member 6: Reviews & Feedback)
 *   - com.event.util       (Shared utilities)
 */
@SpringBootApplication(scanBasePackages = "com.event")
public class EventBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventBookingApplication.class, args);
        System.out.println("============================================");
        System.out.println(" Event Ticket Booking System is running!");
        System.out.println(" Data stored in: /data/*.txt (File Handling)");
        System.out.println(" Visit: http://localhost:8080");
        System.out.println("============================================");
    }
}
