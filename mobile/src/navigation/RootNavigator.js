import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import TopNavActions from '../components/TopNavActions';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import CreateInvoiceScreen from '../screens/CreateInvoiceScreen';
import CreateQuoteScreen from '../screens/CreateQuoteScreen';
import CreateCreditNoteScreen from '../screens/CreateCreditNoteScreen';
import AllocatePaymentScreen from '../screens/AllocatePaymentScreen';
import CreditNoteDetailScreen from '../screens/CreditNoteDetailScreen';
import LoansScreen from '../screens/LoansScreen';
import LoanDetailScreen from '../screens/LoanDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatementsScreen from '../screens/StatementsScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabIcon(routeName, focused, color, size) {
  const iconMap = {
    Dashboard: focused ? 'grid' : 'grid-outline',
    Customers: focused ? 'people' : 'people-outline',
    Invoices: focused ? 'document-text' : 'document-text-outline',
    Loans: focused ? 'cash' : 'cash-outline',
    Statements: focused ? 'receipt' : 'receipt-outline',
    Reports: focused ? 'bar-chart' : 'bar-chart-outline',
  };

  return <Ionicons name={iconMap[routeName] || 'ellipse-outline'} size={size} color={color} />;
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#64748b',
        tabBarIcon: ({ focused, color, size }) => tabIcon(route.name, focused, color, size),
        headerRight: () => <TopNavActions />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Invoices" component={InvoicesScreen} />
      <Tab.Screen name="Loans" component={LoansScreen} />
      <Tab.Screen name="Statements" component={StatementsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: 'Customer Details' }} />
          <Stack.Screen name="EditCustomer" component={EditCustomerScreen} options={{ title: 'Edit Customer' }} />
          <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Invoice Details' }} />
          <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} options={{ title: 'Create Invoice' }} />
          <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} options={{ title: 'Create Quote' }} />
          <Stack.Screen name="CreateCreditNote" component={CreateCreditNoteScreen} options={{ title: 'Add Credit Note' }} />
          <Stack.Screen name="AllocatePayment" component={AllocatePaymentScreen} options={{ title: 'Allocate Payment' }} />
          <Stack.Screen name="CreditNoteDetail" component={CreditNoteDetailScreen} options={{ title: 'Credit Note Details' }} />
          <Stack.Screen name="LoanDetail" component={LoanDetailScreen} options={{ title: 'Loan Details' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
