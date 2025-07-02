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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { AccountIndexProps, Account } from "@/types/account";
import PaginationItems from "@/components/pagination-items";
import { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Eye, Search } from "lucide-react";
import { formatCurrency, formatTimestamp } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Accounts',
      href: '/accounts',
  },
];

export default function AccountIndex({ accounts, filters }: AccountIndexProps) {
    const [search, setSearch] = useState<string>(filters.search || '');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch: FormEventHandler = (e) => {
      e.preventDefault();
      setIsSearching(true);
      
      router.get('/accounts', 
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
      router.get('/accounts', 
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
            <Head title="Accounts" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">                 
                      <Search />
                      <Input
                        placeholder="Search accounts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </form>
                  
                  <div className="flex items-center">
                    <Button>
                      <Link href={route('accounts.create')}>
                        Add Account
                      </Link>
                    </Button>
                  </div>                
                </div>

                <Table>
                    {accounts.data.length > 0 ? 
                      <TableCaption>A list of your recent accounts.</TableCaption>
                      :
                      <TableCaption>No accounts found.</TableCaption>
                    }
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.data.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell>{account.name} </TableCell>
                                <TableCell>{account.type_label}</TableCell>
                                <TableCell>{formatCurrency(account.balance)}</TableCell>
                                <TableCell>{formatTimestamp(account.updated_at)}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline">...</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                          <Link href={route('accounts.show', account.id)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                                          <Link href={route('transactions.create', { account_id: account.id })}>
                                              Create Transaction
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
                    <PaginationItems<Account> data={accounts} handlePageChange={handlePageChange} />
                </div>
            </div>
                 
        </AppLayout>
    )
}