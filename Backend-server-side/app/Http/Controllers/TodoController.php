<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TodoController extends Controller
{
    public function index()
    {
        return Todo::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'file' => 'nullable|mimes:pdf|max:10240' 
        ]);

        $todo = new Todo();
        $todo->title = $request->title;
        $todo->description = $request->description;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads', $fileName, 'public');
            $todo->file_path = '/storage/' . $filePath;
        }
        $todo->save();

        return $todo;
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'file' => 'nullable|mimes:pdf|max:10240'
        ]);
    
        $todo = Todo::findOrFail($id);
        $todo->title = $request->title;
        $todo->description = $request->description;
    
        if ($request->hasFile('file')) {
            if ($todo->file_path) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $todo->file_path));
            }
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads', $fileName, 'public');
            $todo->file_path = '/storage/' . $filePath;
        }
    
        $todo->save();
        return $todo;
    }
    
    
    

    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        
        if ($todo->file_path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $todo->file_path));
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }
}
