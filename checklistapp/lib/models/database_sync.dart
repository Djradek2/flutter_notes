import 'package:checklistapp/models/note.dart';
import 'package:checklistapp/models/note_database.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

class NoteSync {
  static late BuildContext context;

  static Future<void> initialize(BuildContext appContext) async {
    context = appContext;
  }

  static Future<http.Response> fetchFromApi() async {
    http.Response httpResponse1 = await http.get(Uri.parse('http://10.0.0.4:3003/')).timeout(Duration(seconds: 5)); 
    http.Response httpResponse2 = await http.get(Uri.parse('http://10.0.0.4:5277/')).timeout(Duration(seconds: 5)); 
    http.Response httpResponse3 = await http.get(Uri.parse('http://10.0.0.4:8082/')).timeout(Duration(seconds: 5)); 
    print(httpResponse1.body);
    print(httpResponse2.body);
    print(httpResponse3.body);
    return httpResponse1;
  }

  Future<void> getLocalNotes() async {
    List<Note> fetchedNotes = context.read<NoteDatabase>().currentNotes;
  }

  Future<void> getRemoteNotes() async {

  }

  Future<void> backupNotes() async {

  }

  Future<void> restoreNotes() async {

  }
}