import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ events, classes, filters }: { events: any; classes: any; filters: any; auth: any }) {
    const [type, setType] = React.useState(filters.type || '');

    const handleFilter = () => {
        router.get('/events', { type }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = ({id, title}: {id: number, title: string}) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(`/events/${id}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: '/events',
        }
    ]

    const getTypeBadge = (type: 'academic' | 'sports' | 'meeting' | 'holiday' | 'exam' | 'other' | string) => {
        const badges = {
            academic: { variant: 'default', label: 'Academic', color: 'bg-blue-100 text-blue-800' },
            sports: { variant: 'secondary', label: 'Sports', color: 'bg-green-100 text-green-800' },
            meeting: { variant: 'outline', label: 'Meeting', color: 'bg-purple-100 text-purple-800' },
            holiday: { variant: 'secondary', label: 'Holiday', color: 'bg-yellow-100 text-yellow-800' },
            exam: { variant: 'destructive', label: 'Exam', color: 'bg-red-100 text-red-800' },
            other: { variant: 'outline', label: 'Other', color: 'bg-gray-100 text-gray-800' }
        };
        return badges[type as keyof typeof badges] || badges.other;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Events Calendar</h2>
                            <p className="text-muted-foreground">Manage school events and activities</p>
                        </div>
                        <Button asChild>
                            <Link href="/events/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="academic">Academic</SelectItem>
                                        <SelectItem value="sports">Sports</SelectItem>
                                        <SelectItem value="meeting">Meeting</SelectItem>
                                        <SelectItem value="holiday">Holiday</SelectItem>
                                        <SelectItem value="exam">Exam</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter}>Filter</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        {events.data.map((event: any) => {
                            const typeBadge = getTypeBadge(event.type);
                            return (
                                <Card key={event.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                                    <Badge className={typeBadge.color}>{typeBadge.label}</Badge>
                                                </div>
                                                
                                                {event.description && (
                                                    <p className="text-muted-foreground mb-3">{event.description}</p>
                                                )}

                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {event.event_date}
                                                    </div>
                                                    
                                                    {(event.start_time || event.end_time) && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {event.start_time && event.start_time} 
                                                            {event.end_time && ` - ${event.end_time}`}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        <span className="capitalize">{event.target_audience.replace('_', ' ')}</span>
                                                    </div>

                                                    {event.class && (
                                                        <Badge variant="outline">{event.class.name}</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={`/events/${event.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    onClick={() => handleDelete(event.id, event.title)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {events.links && events.links.length > 3 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {events.from} to {events.to} of {events.total} results
                            </div>
                            <div className="flex gap-1">
                                {events.links.map(({link, index}: { link: any, index: any}) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}