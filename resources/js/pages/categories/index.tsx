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
import PaginationItems from "@/components/pagination-items";
import { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, Search, Trash2 } from "lucide-react";
import { Category, CategoryIndexProps } from "@/types/category";
import { formatTimestamp } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Categories',
      href: '/categories',
  },
];

export default function CategoryIndex({ categories, filters }: CategoryIndexProps) {
    const [search, setSearch] = useState<string>(filters.search || '');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch: FormEventHandler = (e) => {
      e.preventDefault();
      setIsSearching(true);
      
      router.get('/categories', 
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
      router.get('/categories', 
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
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">                 
                      <Search />
                      <Input
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </form>
                  
                  <div className="flex items-center">
                    <Button>
                      <Link href={route('categories.create')}>
                        Add Category
                      </Link>
                    </Button>
                  </div>                
                </div>

                <Table>
                    {categories.data.length > 0 ? 
                      <TableCaption>A list of your recent categories.</TableCaption>
                      :
                      <TableCaption>No categories found.</TableCaption>
                    }
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.map(category => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name} </TableCell>
                                <TableCell>
                                  {category.description?.length > 100
                                    ? `${category.description.slice(0, 70)}...`
                                    : category.description
                                  }
                                </TableCell>
                                <TableCell>{formatTimestamp(category.created_at)}</TableCell>
                                <TableCell>{formatTimestamp(category.updated_at)}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline">...</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                          <Link href={route('categories.show', category.id)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive" asChild>
                                          <Link className="w-full" href={route('categories.destroy', category.id)} method="delete">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
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
                    <PaginationItems<Category> data={categories} handlePageChange={handlePageChange} />
                </div>
            </div>
                 
        </AppLayout>
    )
}