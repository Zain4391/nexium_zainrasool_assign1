import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

// GET /api/todos/[id] - Get single todo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const todo = await Todo.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Get todo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, completed, priority, dueDate } =
      await request.json();

    await connectDB();

    const id: any = await params;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: id.id,
        userId: session.user.id,
      },
      {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Update todo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const todo = await Todo.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete todo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
