package com.dentrix.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigReader {

    private static final Properties properties = new Properties();

    static {
        try {
            String path = System.getProperty("user.dir") + "/src/test/resources/config.properties";
            FileInputStream fis = new FileInputStream(path);
            properties.load(fis);
            fis.close();
        } catch (IOException e) {
            properties.setProperty("baseUrl", "http://localhost:3000");
            properties.setProperty("browser", "chrome");
            properties.setProperty("implicitWait", "10");
            properties.setProperty("explicitWait", "15");
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }

    public static String getBaseUrl() {
        return properties.getProperty("baseUrl", "http://localhost:3000");
    }

    public static String getBrowser() {
        return properties.getProperty("browser", "chrome");
    }
}
