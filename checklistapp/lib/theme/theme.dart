import 'package:flutter/material.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(
    surface: Color.fromARGB(255, 227, 227, 227),
    primary: Color.fromARGB(255, 239, 239, 239),
    secondary: Colors.grey.shade400,
    inversePrimary: Colors.black87,
  )
);

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    surface: Colors.grey.shade900,
    primary: Color.fromARGB(255, 52, 52, 52),
    secondary: Colors.grey.shade700,
    inversePrimary: Colors.grey.shade300,
  )
);
