import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, SharedData } from "@/types";
import { CategoryForm } from "@/types/category";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Category create',
        href: '#',
    },
];

export default function CategoryCreate() {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<Required<CategoryForm>>({
        name: '',
        description: '',
        user_id: auth.user.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('categories.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category create" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-12">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Category name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea 
                            placeholder="Type category description here." 
                            id="description"
                            onChange={(e) => setData('description', e.target.value)} 
                        />
                        <p className="text-muted-foreground text-sm">
                            This description is important for understanding your transactions.
                        </p>

                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>              
            </div>
        </AppLayout>
    );
}