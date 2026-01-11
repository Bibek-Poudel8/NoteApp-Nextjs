"use client"
import { useState } from 'react'
import toast from 'react-hot-toast';

const NotesClient = ({ initialNotes }) => {
    const [notes, setNotes] = useState(initialNotes || []);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const createNote = async (e) => {
        e.preventDefault();
        if (title.trim() === "" || content.trim() === "") {
            setError("Title and content are required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            const result = await response.json();
            if(result.success){
                setNotes([result.data, ...notes])
                toast.success("Notes created successfully");
                setTitle("");
                setContent("");
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    const deleteNote = async (id) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if(result.success){
                setNotes(notes.filter((note) => note._id !== id));
                toast.success("Note deleted successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete note");
        }
    }

    return (
        <div className='space-y-6'>
            <form className='bg-white p-6 rounded shadow-md' onSubmit={createNote}>
                <h2 className='text-xl text-gray-800 font-semibold mb-4'>Create New Note</h2>

                {/* {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                        Note saved successfully!
                    </div>
                )} */}

                <div className='space-y-4'>
                    <div>
                        <label className='block text-gray-700 mb-2' htmlFor='title'>Note Title</label>
                        <input
                            type='text'
                            id='title'
                            placeholder='Note title'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-gray-700 mb-2' htmlFor='content'>Note Content</label>
                        <textarea
                            placeholder='Note Content'
                            id='content'
                            rows={5}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring disabled:bg-gray-400'
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Note"}
                    </button>
                </div>
            </form>
            <div className='space-y-4'>
                <h2 className='text-xl text-gray-800 font-semibold'>Existing Notes({notes.length})</h2>
                {
                    notes.length === 0 ? (
                        <p className='text-gray-600'>No notes available.</p>
                    ) : (
                        notes.map((note) => (
                            <div key={note._id} className='border border-gray-300 rounded-md p-4 bg-white shadow-sm'>
                                <div className='flex justify-between items-start mb-2'>
                                    <h3 className='text-lg font-semibold text-gray-800 flex-1 pr-4'>{note.title}</h3>
                                    <div className='flex gap-2 shrink-0'>
                                        <button className='text-blue-500 hover:text-blue-700 text-sm cursor-pointer transition-colors duration-200 font-medium'>Edit</button>
                                        <button onClick={() => deleteNote(note._id)} className='text-red-500 hover:text-red-700 text-sm cursor-pointer transition-colors duration-200 font-medium'>Delete</button>
                                    </div>
                                </div>
                                <p className='text-gray-700 whitespace-pre-wrap'>{note.content}</p>
                                <p className='text-gray-500 text-sm mt-4'>Created At: {new Date(note.createdAt).toLocaleString()}</p>
                                {note.updatedAt !== note.createdAt && (
                                    <p className='text-gray-500 text-sm'>Updated At: {new Date(note.updatedAt).toLocaleString()}</p>
                                )}
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default NotesClient;