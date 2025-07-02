import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, SharedData } from "@/types";
import { AccountForm } from "@/types/account";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
    {
        title: 'Account create',
        href: '#',
    },
];

export default function AccountCreate() {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<Required<AccountForm>>({
        name: '',
        type: 'debit',
        balance: '',
        user_id: auth.user.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('accounts.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />

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
                            placeholder="Account name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>

                        <RadioGroup defaultValue={data.type} onValueChange={(e) => setData('type', e)} required>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="debit" id="r1"/>
                                <Label htmlFor="r1">Debit</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="savings" id="r2" />
                                <Label htmlFor="r2">Savings</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="credit" id="r3" />
                                <Label htmlFor="r3">Credit Card</Label>
                            </div>
                        </RadioGroup>

                        <InputError className="mt-2" message={errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="balance">Balance</Label>

                        <Input
                            type="number"
                            id="balance"
                            step="0.01"
                            min="0.01"
                            className="mt-1 block w-full"
                            value={data.balance}
                            onChange={(e) => setData('balance', Number(e.target.value))}
                            required
                            placeholder="0.00"
                        />

                        <InputError className="mt-2" message={errors.balance} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>              
            </div>
        </AppLayout>
    );
}