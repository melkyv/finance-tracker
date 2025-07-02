import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="font-bold">{label}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-bold">{formatCurrency(payload[0].value)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default function Chart({ data }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
    );
}