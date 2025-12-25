import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function EventCreateEdit({ auth, event, classes }) {
    const isEdit = !!event;
    
    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title || '',
        description: event?.description || '',
        event_date: event?.event_date || '',
        start_time: event?.start_time || '',
        end_time: event?.end_time || '',
        type: event?.type || '',
        target_audience: event?.target_audience || '',
        class_id: event?.class_id?.toString() || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/events/${event.id}`);
        } else {
            post('/events');
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Event' : 'Add Event'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/events">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Event' : 'Add New Event'}
                            </h2>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Event Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Sports Day"
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event_date">
                                        Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="event_date"
                                        type="date"
                                        value={data.event_date}
                                        onChange={(e) => setData('event_date', e.target.value)}
                                    />
                                    {errors.event_date && <p className="text-sm text-destructive">{errors.event_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">
                                        Event Type <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="academic">Academic</SelectItem>
                                            <SelectItem value="sports">Sports</SelectItem>
                                            <SelectItem value="meeting">Meeting</SelectItem>
                                            <SelectItem value="holiday">Holiday</SelectItem>
                                            <SelectItem value="exam">Exam</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="target_audience">
                                        Target Audience <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.target_audience} onValueChange={(value) => setData('target_audience', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="students">Students</SelectItem>
                                            <SelectItem value="teachers">Teachers</SelectItem>
                                            <SelectItem value="parents">Parents</SelectItem>
                                            <SelectItem value="specific_class">Specific Class</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.target_audience && <p className="text-sm text-destructive">{errors.target_audience}</p>}
                                </div>
                            </div>

                            {data.target_audience === 'specific_class' && (
                                <div className="space-y-2">
                                    <Label htmlFor="class_id">Select Class</Label>
                                    <Select value={data.class_id} onValueChange={(value) => setData('class_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <Button type="button" onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/events">Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}