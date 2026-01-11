import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";




export async function GET() {
    try {
        await dbConnect();
        const notes = await Note.find().sort({ createdAt: -1 });
        return NextResponse.json({ data: notes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch notes", error: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const note = await Note.create(body);
        return NextResponse.json({ success: true, message: "Note created successfully", data: note }, { status: 201 });
    } catch (error) {
        // Log complete error details
        console.error("=== FULL ERROR ===");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("Error object:", error);
        
        return NextResponse.json({ 
            message: "Failed to create note", 
            error: error.message,
            stack: error.stack  // This will show in browser
        }, { status: 500 });
    }
}