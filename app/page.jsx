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
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Notes App</h1>
        <p className="mt-2 text-gray-600">A simple, elegant place to capture your thoughts.</p>
      </div>
      <NotesClient initialNotes={notes} />
    </div>
  );
}
