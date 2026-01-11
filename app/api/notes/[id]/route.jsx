import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";


export async function PUT(request, { params }) {
try {
    
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const note = await Note.findByIdAndUpdate(id,
         {...body, updatedAt: Date.now() },
            { new: true , runValidators: true }
    );
    if (!note) {
        return NextResponse.json({ success:false, error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json({ success:true, message: "Note updated successfully", data: note }, { status: 200 });
} catch (error) {
    return NextResponse.json({ success:false, message: "Failed to update note", error: error.message }, { status: 500 });
}

}


export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return NextResponse.json({ success:false, error: "Note not found" }, { status: 404 });
        }
        return NextResponse.json({ success:true, data: {}})
    } catch (error) {
        return NextResponse.json({ success:false, message: "Failed to delete note", error: error.message }, { status: 500 });
    }
}