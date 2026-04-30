import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  useBudgetStore,
  usePurchaseOrderStore,
  useSalesOrderStore,
  useCustomerInvoiceStore,
  useVendorBillStore,
  useContactStore,
  useProductStore,
} from '@/stores';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  FileText,
  DollarSign,
  ArrowRight,
  PieChart,
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { budgets } = useBudgetStore();
  const { orders: purchaseOrders } = usePurchaseOrderStore();
  const { orders: salesOrders } = useSalesOrderStore();
  const { invoices } = useCustomerInvoiceStore();
  const { bills } = useVendorBillStore();
  const { contacts } = useContactStore();
  const { products } = useProductStore();

  const activeBudgets = budgets.filter((b) => b.state === 'confirmed' && !b.isArchived);
  const incomeBudgets = activeBudgets.filter((b) => b.type === 'income');
  const expenseBudgets = activeBudgets.filter((b) => b.type === 'expense');

  const totalBudgetedIncome = incomeBudgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
  const totalAchievedIncome = incomeBudgets.reduce((sum, b) => sum + b.achievedAmount, 0);
  const totalBudgetedExpense = expenseBudgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
  const totalAchievedExpense = expenseBudgets.reduce((sum, b) => sum + b.achievedAmount, 0);

  const pendingSalesOrders = salesOrders.filter((o) => o.status === 'draft').length;
  const pendingPurchaseOrders = purchaseOrders.filter((o) => o.status === 'draft').length;
  const unpaidInvoices = invoices.filter((i) => i.status !== 'paid' && !i.isArchived).length;
  const unpaidBills = bills.filter((b) => b.status !== 'paid' && !b.isArchived).length;

  const budgetPieData = [
    { name: 'Achieved', value: totalAchievedIncome, color: 'hsl(var(--chart-3))' },
    { name: 'Remaining', value: totalBudgetedIncome - totalAchievedIncome, color: 'hsl(var(--chart-1))' },
  ];

  const expensePieData = [
    { name: 'Spent', value: totalAchievedExpense, color: 'hsl(var(--chart-2))' },
    { name: 'Remaining', value: totalBudgetedExpense - totalAchievedExpense, color: 'hsl(var(--chart-5))' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-5xl font-bold text-gradient-primary tracking-tight">
            Welcome back, {profile?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-lg text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • {isAdmin ? 'Admin' : 'Portal'} Dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-success transition-all hover:shadow-xl hover-scale overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income (Budget)
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums animate-count-up">{formatCurrency(totalAchievedIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of <span className="font-semibold tabular-nums">{formatCurrency(totalBudgetedIncome)}</span> budgeted
              </p>
              <div className="mt-3 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-success transition-all duration-700 ease-out"
                  style={{ width: `${totalBudgetedIncome > 0 ? Math.min((totalAchievedIncome / totalBudgetedIncome) * 100, 100) : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning transition-all hover:shadow-xl hover-scale overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses (Budget)
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums animate-count-up">{formatCurrency(totalAchievedExpense)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of <span className="font-semibold tabular-nums">{formatCurrency(totalBudgetedExpense)}</span> budgeted
              </p>
              <div className="mt-3 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-warning transition-all duration-700 ease-out"
                  style={{ width: `${totalBudgetedExpense > 0 ? Math.min((totalAchievedExpense / totalBudgetedExpense) * 100, 100) : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary transition-all hover:shadow-xl hover-scale overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums animate-count-up">{pendingSalesOrders + pendingPurchaseOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-semibold">{pendingSalesOrders}</span> sales, <span className="font-semibold">{pendingPurchaseOrders}</span> purchase
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive transition-all hover:shadow-xl hover-scale overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums animate-count-up">{unpaidInvoices + unpaidBills}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-semibold">{unpaidInvoices}</span> invoices, <span className="font-semibold">{unpaidBills}</span> bills
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Charts */}
        {isAdmin && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-2xl transition-all overflow-hidden relative group border-gradient">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b bg-gradient-to-r from-success/5 to-transparent relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <PieChart className="h-4 w-4 text-success" />
                  </div>
                  Income Budget Achievement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={budgetPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {budgetPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
                  <span className="text-5xl font-bold text-success tabular-nums animate-count-up">
                    {totalBudgetedIncome > 0
                      ? Math.round((totalAchievedIncome / totalBudgetedIncome) * 100)
                      : 0}
                    %
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">achieved</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-2xl transition-all overflow-hidden relative group border-gradient">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b bg-gradient-to-r from-warning/5 to-transparent relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <PieChart className="h-4 w-4 text-warning" />
                  </div>
                  Expense Budget Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 text-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg border border-warning/20">
                  <span className="text-5xl font-bold text-warning tabular-nums animate-count-up">
                    {totalBudgetedExpense > 0
                      ? Math.round((totalAchievedExpense / totalBudgetedExpense) * 100)
                      : 0}
                    %
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">utilized</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-primary/30 hover:bg-primary/5"
                onClick={() => navigate('/account/contacts')}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">Contacts</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {contacts.filter((c) => !c.isArchived).length} active
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-accent/30 hover:bg-accent/5"
                onClick={() => navigate('/account/products')}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <span className="font-semibold">Products</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {products.filter((p) => !p.isArchived).length} active
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-success/30 hover:bg-success/5"
                onClick={() => navigate('/account/budgets')}
              >
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-success" />
                </div>
                <span className="font-semibold">Budgets</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {activeBudgets.length} active
                </span>
              </Button>
            </>
          )}

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-primary/30 hover:bg-primary/5"
            onClick={() => navigate('/sale/orders')}
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold">Sales Orders</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {salesOrders.filter((o) => !o.isArchived).length} total
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-info/30 hover:bg-info/5"
            onClick={() => navigate('/sale/invoices')}
          >
            <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-info" />
            </div>
            <span className="font-semibold">Invoices</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {unpaidInvoices} unpaid
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 p-6 hover-lift border-2 hover:border-warning/30 hover:bg-warning/5"
            onClick={() => navigate('/purchase/orders')}
          >
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-warning" />
            </div>
            <span className="font-semibold">Purchase Orders</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {purchaseOrders.filter((o) => !o.isArchived).length} total
            </span>
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-lg">Recent Sales Orders</CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => navigate('/sale/orders')}>
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {salesOrders
                  .filter((o) => !o.isArchived)
                  .slice(0, 5)
                  .map((order) => {
                    const customer = contacts.find((c) => c.id === order.customerId);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm cursor-pointer group"
                        onClick={() => navigate(`/sale/orders/${order.id}`)}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{customer?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold tabular-nums">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{order.status}</p>
                        </div>
                      </div>
                    );
                  })}
                {salesOrders.filter((o) => !o.isArchived).length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No sales orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-info/5 to-transparent">
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-info/10" onClick={() => navigate('/sale/invoices')}>
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {invoices
                  .filter((i) => !i.isArchived)
                  .slice(0, 5)
                  .map((invoice) => {
                    const customer = contacts.find((c) => c.id === invoice.customerId);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:bg-info/5 hover:border-info/30 hover:shadow-sm cursor-pointer group"
                        onClick={() => navigate(`/sale/invoices/${invoice.id}`)}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-info transition-colors">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{customer?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold tabular-nums">{formatCurrency(invoice.totalAmount)}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">
                            {invoice.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {invoices.filter((i) => !i.isArchived).length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No invoices yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
