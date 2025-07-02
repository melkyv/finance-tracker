import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { TransactionForm, TransactionCreateProps } from "@/types/transaction";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
    {
        title: 'Create Transaction',
        href: '#',
    },
];

export default function TransactionCreate({ accounts, categories, transactionTypes, accountId }: TransactionCreateProps) {
    const { data, setData, post, processing, errors } = useForm<Required<TransactionForm>>({
        account_id: accountId ?? '',
        category_id: '',
        description: '',
        amount: '',
        type: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('transactions.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-12">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="account_id">Account</Label>
                        
                        <Select value={data.account_id.toString()} onValueChange={(value) => setData('account_id', parseInt(value))} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.name} ({account.type_label})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.account_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        
                        <Select value={data.category_id.toString()} onValueChange={(value) => setData('category_id', parseInt(value))} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Transaction Type</Label>
                        
                        <Select value={data.type} onValueChange={(value) => setData('type', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            <SelectContent>
                                {transactionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            className="mt-1 block w-full"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Transaction description"
                            rows={3}
                        />

                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>

                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="amount"
                            className="mt-1 block w-full"
                            value={data.amount}
                            onChange={(e) => setData('amount', parseFloat(e.target.value) || '')}
                            required
                            placeholder="0.00"
                        />

                        <InputError className="mt-2" message={errors.amount} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>
                            {processing ? 'Creating...' : 'Create Transaction'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>              
            </div>
        </AppLayout>
    );
}

