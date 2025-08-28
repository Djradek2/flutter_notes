import 'package:checklistapp/models/database_sync.dart';
import 'package:checklistapp/models/note_database.dart';
import 'package:checklistapp/pages/notes_page.dart';
import 'package:checklistapp/theme/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NoteDatabase.initialize();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => NoteDatabase()),
        ChangeNotifierProvider(create: (context) => ThemeProvider()),
        ChangeNotifierProvider(create: (context) => NoteSync()),
      ],
      child: const MyApp(),
    )
  );

  // runApp(
  //   ChangeNotifierProvider(
  //     create: (context) => NoteDatabase(),
  //     child: const MyApp()
  //   )
  // );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: NotesPage(),
      theme: Provider.of<ThemeProvider>(context).themeData,
    );
  }
}
