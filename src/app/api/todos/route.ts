import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

interface TodoQuery {
  userId: string;
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
  >;
  priority?: string;
  completed?: boolean;
}

// GET /api/todos - Get all todos for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get search and filter params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const priority = searchParams.get("priority");
    const completed = searchParams.get("completed");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build query
    const query: TodoQuery = { userId: session.user.id };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add priority filter
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    // Add completed filter
    if (completed && completed !== "all") {
      query.completed = completed === "true";
    }

    // Execute query with sorting
    const todos = await Todo.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .lean();

    return NextResponse.json({ todos });
  } catch (error) {
    console.error("Get todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, priority, dueDate } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();

    const todo = await Todo.create({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: session.user.id,
    });

    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    console.error("Create todo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
