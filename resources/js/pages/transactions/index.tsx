import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { TransactionIndexProps, Transaction, getTypeColor } from "@/types/transaction";
import PaginationItems from "@/components/pagination-items";
import { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Eye, Edit } from "lucide-react";
import { formatCurrency, formatTimestamp } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Transactions',
      href: '/transactions',
  },
];

export default function TransactionIndex({ transactions, filters }: TransactionIndexProps) {
    const [search, setSearch] = useState<string>(filters.search || '');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch: FormEventHandler = (e) => {
      e.preventDefault();
      setIsSearching(true);
      
      router.get('/transactions', 
          { 
            search: search,
            page: 1
          }, 
          {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSearching(false)
          }
      );
    }

    const handlePageChange = (page: number) => {
      router.get('/transactions', 
          { 
            page: page,
            search: filters.search, 
          }, 
          {
            preserveState: true,
            preserveScroll: true
          }
      );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">                 
                      <Search />
                      <Input
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </form>
                  
                  <div className="flex items-center">
                    <Button>
                      <Link href={route('transactions.create')}>
                        Add Transaction
                      </Link>
                    </Button>
                  </div>                
                </div>

                <Table>
                    {transactions.data.length > 0 ? 
                      <TableCaption>A list of your recent transactions.</TableCaption>
                      :
                      <TableCaption>No transactions found.</TableCaption>
                    }
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.data.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                  {transaction.description?.length > 100
                                    ? `${transaction.description.slice(0, 70)}...`
                                    : transaction.description ?? 'N/A'
                                  }
                                </TableCell>
                                <TableCell>{transaction.account?.name}</TableCell>
                                <TableCell>{transaction.category?.name}</TableCell>
                                <TableCell>
                                  <span className={getTypeColor(transaction.type)}>
                                    {transaction.type_label}
                                  </span>
                                </TableCell>
                                <TableCell className={getTypeColor(transaction.type)}>
                                  {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell>
                                  {formatTimestamp(transaction.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline">...</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                          <Link href={route('transactions.show', transaction.id)} className="flex items-center">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                          <Link href={route('transactions.edit', transaction.id)} className="flex items-center">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </Link>
                                        </DropdownMenuItem>       
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>  
                </Table>

                <div className="flex justify-center">
                    <PaginationItems<Transaction> data={transactions} handlePageChange={handlePageChange} />
                </div>
            </div>
                 
        </AppLayout>
    )
}

