<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ClassModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['class', 'creator']);

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        $events = $query->latest('event_date')->paginate($request->per_page ?? 15);
        $classes = ClassModel::all();

        return Inertia::render('Events/Index', [
            'events' => $events,
            'classes' => $classes,
            'filters' => $request->only(['type'])
        ]);
    }

    public function create()
    {
        $classes = ClassModel::all();

        return Inertia::render('Events/Create', [
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'type' => 'required|in:academic,sports,meeting,holiday,exam,other',
            'target_audience' => 'required|in:all,students,teachers,parents,specific_class',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        $validated['created_by'] = auth()->id();
        Event::create($validated);

        return redirect()->route('events.index')
            ->with('success', 'Event created successfully');
    }

    public function show($id)
    {
        $event = Event::with(['class', 'creator'])->findOrFail($id);

        return Inertia::render('Events/Show', [
            'event' => $event
        ]);
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);
        $classes = ClassModel::all();

        return Inertia::render('Events/Edit', [
            'event' => $event,
            'classes' => $classes
        ]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'sometimes|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'type' => 'sometimes|in:academic,sports,meeting,holiday,exam,other',
            'target_audience' => 'sometimes|in:all,students,teachers,parents,specific_class',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        $event->update($validated);

        return redirect()->route('events.index')
            ->with('success', 'Event updated successfully');
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->route('events.index')
            ->with('success', 'Event deleted successfully');
    }

    public function upcoming()
    {
        $events = Event::where('event_date', '>=', today())
            ->with(['class'])
            ->orderBy('event_date')
            ->limit(10)
            ->get();

        return Inertia::render('Events/Upcoming', [
            'events' => $events
        ]);
    }
}