package com.aws.mon.utils;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
public class DateTimeUtils {
    public static String now() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        return dtf.format(LocalDateTime.now(ZoneId.of("Europe/Berlin")));
    }

    public static LocalDateTime now( String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        return LocalDateTime.parse(dateTime, formatter);
    }
}
