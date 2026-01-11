import Image from "next/image";
import dbConnect from "@/lib/db";
import NotesClient from "@/components/NotesClient";
import Note from "@/models/Note";


async function getNotes() {
    await dbConnect();
  const notes = await Note.find({}).limit(5).sort({createdAt:-1}).lean();
  return notes.map((note) => ({
    ...note,
    _id:note._id.toString(),
  })); 
}

export default async function Home() {
  const notes = await getNotes();
  console.log("notes", notes);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>
    <NotesClient initialNotes={notes} />
    </div>
  );
}
