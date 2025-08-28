import 'package:checklistapp/components/note_settings.dart';
import 'package:flutter/material.dart';
import 'package:popover/popover.dart';

class NoteTile extends StatelessWidget {
  final String text;
  final void Function()? onEditPressed;
  final void Function()? onDeletePressed;

  const NoteTile({
    super.key,
    required this.text,
    required this.onEditPressed,
    required this.onDeletePressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary,
        borderRadius: BorderRadius.circular(8),
      ),
      margin: const EdgeInsets.only(top: 10, left: 15, right: 25),
      child: ListTile(
        title: Text(text),
        contentPadding: EdgeInsets.only(left: 20, right: 7),
        trailing: Builder(
          builder: (context) {
            return IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () => showPopover(
                width: 100,
                height: 100,
                backgroundColor: Theme.of(context).colorScheme.surface,
                context: context, 
                bodyBuilder: (context) => NoteSettings(
                  onEditTap: () {
                    onEditPressed!();
                  },
                  onDeleteTap: () {
                    onDeletePressed!();
                  },
                ),
              ), 
            );
          }
        ),
        // contentPadding: EdgeInsets.only(left: 20, right: 7),
        // title: Text(text),
        // trailing: Row(
        //   mainAxisSize: MainAxisSize.min,
        //   children: [
        //     IconButton(
        //       onPressed: onEditPressed, 
        //       icon: const Icon(Icons.edit),
        //     ),
        //     IconButton(
        //       onPressed: onDeletePressed, 
        //       icon: const Icon(Icons.delete),
        //     )
        //   ],
        // ),
      ),
    );
  }
}

