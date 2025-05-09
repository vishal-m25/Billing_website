import { useToast } from "@/components/ui/use-toast";

export interface Part {
  _id?: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  manufacturer: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  address: CustomerAddress;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}




export interface InvoiceItem {
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes: string;
  createdAt?: Date;
  dueDate: Date;
}

const BASE_URL = "http://localhost:5000/api";

// Parts API
export const fetchParts = async (): Promise<Part[]> => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch parts");
  return res.json();
};

export const addPart = async (part: Omit<Part, "_id" | "createdAt" | "updatedAt">): Promise<Part> => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part)
  });
  if (!res.ok) throw new Error("Failed to add part");
  return res.json();
};

export const updatePart = async (part: Partial<Part> & { _id: string }): Promise<Part> => {
  const res = await fetch(`${BASE_URL}/products/${part._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part)
  });
  if (!res.ok) throw new Error("Failed to update part");
  return res.json();
};

export const deletePart = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete part");
  }
};


// Customers API
export const fetchCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};
export const fetchCustomer = async (id:any): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
};

export const addCustomer = async (
  customer: Omit<Customer, "_id">
): Promise<Customer> => {
  if (!customer.name || !customer.phone || 
    !customer.address || !customer.address.street || !customer.address.zipCode) {
  throw new Error("All required customer fields are missing");
}
  try {
    console.log("Sending customer to backend:", customer);

    const res = await fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend rejected the request:", errorText);
      throw new Error(`Failed to add customer: ${res.status} ${res.statusText}`);
    }

    const result: Customer = await res.json();
    console.log("Customer added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customer: Partial<Customer> & { _id: string }): Promise<Customer> => {

    console.log("Updating customer through API:", customer);

    
    try {
      const response = await fetch(`${BASE_URL}/customers/${customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating customer: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };
  
  

export const deleteCustomer = async (customerId: string): Promise<boolean> => {

    console.log("Deleting customer through API:", customerId);

    
    try {
      const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting customer: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  };




// Invoices API
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const res = await fetch(`${BASE_URL}/invoices`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

export const createInvoice = async (invoice: Omit<Invoice, '_id' | 'createdAt'>): Promise<Invoice> => {
  const res = await fetch(`${BASE_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice)
  });
  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {

    console.log("Fetching invoice details from API:", invoiceId);
 
    
    try {
      const response = await fetch(`${BASE_URL}/invoices/${invoiceId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching invoice: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  };
  
  

// Toast API Wrapper
export const useApiWithToast = () => {
  const { toast } = useToast();

  const withToastHandling = async <T>(
    apiCall: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    try {
      const result = await apiCall();
      if (successMessage) {
        toast({ title: "Success", description: successMessage, variant: "default" });
      }
      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: errorMessage || error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    fetchPartsWithToast: (successMessage?: string) =>
      withToastHandling(() => fetchParts(), successMessage, "Failed to fetch parts"),

    addPartWithToast: (part: Omit<Part, '_id' | 'createdAt' | 'updatedAt'>, successMessage = "Part added successfully") =>
      withToastHandling(() => addPart(part), successMessage, "Failed to add part"),

    updatePartWithToast: (part: Partial<Part> & { _id: string }, successMessage = "Part updated successfully") =>
      withToastHandling(() => updatePart(part), successMessage, "Failed to update part"),

    fetchCustomersWithToast: (successMessage?: string) =>
      withToastHandling(() => fetchCustomers(), successMessage, "Failed to fetch customers"),

    addCustomerWithToast: (
      customer: Omit<Customer, '_id' >,
      successMessage = "Customer added successfully"
    ) =>
      withToastHandling(() => addCustomer(customer), successMessage, "Failed to add customer"),
    
      deletedataWithToast: (id:any,successMessage?: string) =>
        withToastHandling(() => deletePart(id), successMessage, "Failed to delete data"),
  
      updateCustomerWithToast: (customer: Partial<Customer> & { _id: string }, successMessage = "Customer updated successfully") =>
        withToastHandling(() => updateCustomer(customer), successMessage, "Failed to update customer"),
      
      deleteCustomerWithToast: (customerId: string, successMessage = "Customer deleted successfully") =>
        withToastHandling(() => deleteCustomer(customerId), successMessage, "Failed to delete customer"),

    fetchInvoicesWithToast: (successMessage?: string) =>
      withToastHandling(() => fetchInvoices(), successMessage, "Failed to fetch invoices"),

    createInvoiceWithToast: (invoice: Omit<Invoice, '_id' | 'createdAt'>, successMessage = "Invoice created successfully") =>
      withToastHandling(() => createInvoice(invoice), successMessage, "Failed to create invoice"),
  };
};
