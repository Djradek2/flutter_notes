import 'dart:convert';
import 'package:checklistapp/models/note.dart';
import 'package:checklistapp/models/note_database.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class NoteSync with ChangeNotifier {
  String? jwtToken; //null itself if status is 401 or 403 after request

  NoteSync();

  Future<void> loginToAPI(context, String name, String password) async { //http.Response
    try {
      http.Response httpResponse = await http.post(
        Uri.parse('http://10.0.0.4:8082/login'), //ports: 5 2 7 7 - C#, 3 0 0 3 - Express, 8 0 8 2 - Spring
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'username': name,
          'password': password,
        })
      ).timeout(Duration(seconds: 5)); 
      if (httpResponse.statusCode == 401) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Invalid Credentials!")),
        );
        return;
      }
      final receivedData = jsonDecode(httpResponse.body);
      if (receivedData.containsKey('token')) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Login Successful!")),
        );
        jwtToken = receivedData['token']; //valid for 1H
        notifyListeners();
      }
      return;
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Could not contact server.")),
      );
    }
  }

  Future<void> backupNotes(context, NoteDatabase notes) async {
    if (jwtToken != null) {
      await notes.fetchNotes();
      List<Note> fetchedNotes = notes.currentNotes;
      List<Map<String, dynamic>> notesList = [];
      for (final note in fetchedNotes) {
        Map<String, dynamic> sendableNote = <String, dynamic>{};
        sendableNote['title'] = note.title;
        sendableNote['text'] = note.text;
        notesList.add(sendableNote);
      }
      http.Response httpResponse = await http.post(
        Uri.parse('http://10.0.0.4:8082/backup_notes'),
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + (jwtToken ?? "0"),
        },
        body: jsonEncode({"notes": notesList})
      ).timeout(Duration(seconds: 5)); 
      if (httpResponse.statusCode == 401 || httpResponse.statusCode == 403) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Login timed out!")),
        );
        jwtToken = null;
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Notes saved!")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please Login.")),
      );
    }
  }

  Future<void> restoreNotes(context, NoteDatabase notes) async {
    if (jwtToken != null) {
      http.Response httpResponse = await http.get(
        Uri.parse('http://10.0.0.4:8082/reload_backup'),
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + (jwtToken ?? "0"),
        }
      ).timeout(Duration(seconds: 5)); 
      if (httpResponse.statusCode == 401 || httpResponse.statusCode == 403) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Login timed out!")),
        );
        jwtToken = null;
        return;
      }
      final receivedData = jsonDecode(httpResponse.body);
      if (!receivedData.containsKey('data')) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("You have no backup saved.")),
        );
        return;
      }
      if (!context.mounted) return; //checks if user is still on the backup screen

      notes.clearNotes();
      for (final note in receivedData['data']) {
        notes.addNote(note['text']); //TODO: replace with a single bulk add function
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Backups restored!")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please Login.")),
      );
    }
  }
}