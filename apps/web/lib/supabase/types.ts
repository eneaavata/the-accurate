export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string;
          id: string;
          line_one: string | null;
          line_two: string | null;
          organisation_id: string;
          postal_code: string | null;
          state: string | null;
          updated_at: string;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          line_one?: string | null;
          line_two?: string | null;
          organisation_id: string;
          postal_code?: string | null;
          state?: string | null;
          updated_at?: string;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          line_one?: string | null;
          line_two?: string | null;
          organisation_id?: string;
          postal_code?: string | null;
          state?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      attribute_values: {
        Row: {
          attribute_id: string;
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          attribute_id: string;
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          attribute_id?: string;
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attribute_values_attribute_id_fkey';
            columns: ['attribute_id'];
            isOneToOne: false;
            referencedRelation: 'attributes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attribute_values_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      attributes: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attributes_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      branch_employees: {
        Row: {
          branch_id: string;
          created_at: string;
          employee_id: string;
          organisation_id: string;
        };
        Insert: {
          branch_id: string;
          created_at?: string;
          employee_id: string;
          organisation_id: string;
        };
        Update: {
          branch_id?: string;
          created_at?: string;
          employee_id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'branch_employees_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'branch_employees_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'branch_employees_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      branches: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'branches_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      contacts: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          party_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          party_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          party_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_party_id_fkey';
            columns: ['party_id'];
            isOneToOne: false;
            referencedRelation: 'parties';
            referencedColumns: ['id'];
          },
        ];
      };
      customers: {
        Row: {
          created_at: string;
          organisation_id: string;
          party_id: string;
        };
        Insert: {
          created_at?: string;
          organisation_id: string;
          party_id?: string;
        };
        Update: {
          created_at?: string;
          organisation_id?: string;
          party_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'party_customers_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'party_customers_party_id_fkey';
            columns: ['party_id'];
            isOneToOne: true;
            referencedRelation: 'parties';
            referencedColumns: ['id'];
          },
        ];
      };
      employees: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'employees_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      invoice_lines: {
        Row: {
          created_at: string;
          id: string;
          invoice_id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invoice_id: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invoice_id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invoice_lines_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoice_lines_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      organisation_users: {
        Row: {
          created_at: string;
          organisation_id: string;
          role_id: string;
          status: Database['public']['Enums']['organisation_user_status'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          organisation_id: string;
          role_id: string;
          status?: Database['public']['Enums']['organisation_user_status'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          organisation_id?: string;
          role_id?: string;
          status?: Database['public']['Enums']['organisation_user_status'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organisation_members_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organisation_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organisation_users_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      organisations: {
        Row: {
          billing_status: Database['public']['Enums']['billing_status'];
          created_at: string;
          email: string;
          grace_ends_at: string | null;
          has_ever_paid: boolean;
          id: string;
          is_active: boolean;
          name: string;
          seat_limit: number;
          seats_used: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_ends_at: string | null;
          trial_ends_at: string | null;
          updated_at: string;
        };
        Insert: {
          billing_status?: Database['public']['Enums']['billing_status'];
          created_at?: string;
          email: string;
          grace_ends_at?: string | null;
          has_ever_paid?: boolean;
          id?: string;
          is_active?: boolean;
          name: string;
          seat_limit?: number;
          seats_used?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Update: {
          billing_status?: Database['public']['Enums']['billing_status'];
          created_at?: string;
          email?: string;
          grace_ends_at?: string | null;
          has_ever_paid?: boolean;
          id?: string;
          is_active?: boolean;
          name?: string;
          seat_limit?: number;
          seats_used?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      parties: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'parties_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_methods: {
        Row: {
          created_at: string;
          id: string;
          is_default: boolean;
          organisation_id: string;
          stripe_payment_method_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          organisation_id: string;
          stripe_payment_method_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          organisation_id?: string;
          stripe_payment_method_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_methods_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      permissions: {
        Row: {
          key: string;
        };
        Insert: {
          key: string;
        };
        Update: {
          key?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          category_id: string;
          created_at: string;
          organisation_id: string;
          product_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          organisation_id: string;
          product_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          organisation_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_categories_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_categories_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      purchase_order_lines: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          purchase_order_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          purchase_order_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          purchase_order_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchase_order_lines_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'purchase_order_lines_purchase_order_id_fkey';
            columns: ['purchase_order_id'];
            isOneToOne: false;
            referencedRelation: 'purchase_orders';
            referencedColumns: ['id'];
          },
        ];
      };
      purchase_orders: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchase_order_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      quotation_lines: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          quotation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          quotation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          quotation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotation_lines_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quotation_lines_quotation_id_fkey';
            columns: ['quotation_id'];
            isOneToOne: false;
            referencedRelation: 'quotations';
            referencedColumns: ['id'];
          },
        ];
      };
      quotations: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotations_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      requisition_lines: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          requisition_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          requisition_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          requisition_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'requisition_lines_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'requisition_lines_requisition_id_fkey';
            columns: ['requisition_id'];
            isOneToOne: false;
            referencedRelation: 'requisitions';
            referencedColumns: ['id'];
          },
        ];
      };
      requisitions: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'requisitions_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          created_at: string;
          organisation_id: string;
          permission_key: string;
          role_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          organisation_id: string;
          permission_key: string;
          role_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          organisation_id?: string;
          permission_key?: string;
          role_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_permission_key_fkey';
            columns: ['permission_key'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['key'];
          },
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          organisation_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          organisation_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          organisation_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'roles_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      sales_order_lines: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          sales_order_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          sales_order_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          sales_order_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_order_lines_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_order_lines_sales_order_id_fkey';
            columns: ['sales_order_id'];
            isOneToOne: false;
            referencedRelation: 'sales_orders';
            referencedColumns: ['id'];
          },
        ];
      };
      sales_orders: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_order_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
      suppliers: {
        Row: {
          created_at: string;
          organisation_id: string;
          party_id: string;
        };
        Insert: {
          created_at?: string;
          organisation_id: string;
          party_id: string;
        };
        Update: {
          created_at?: string;
          organisation_id?: string;
          party_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'party_suppliers_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'party_suppliers_party_id_fkey';
            columns: ['party_id'];
            isOneToOne: true;
            referencedRelation: 'parties';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          id: string;
          is_active: boolean;
          trial_available: boolean;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          id: string;
          is_active?: boolean;
          trial_available?: boolean;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          id?: string;
          is_active?: boolean;
          trial_available?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      variant_values: {
        Row: {
          created_at: string;
          organisation_id: string;
          value_id: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          organisation_id: string;
          value_id: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          organisation_id?: string;
          value_id?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'variant_values_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'variant_values_value_id_fkey';
            columns: ['value_id'];
            isOneToOne: false;
            referencedRelation: 'attribute_values';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'variant_values_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'variants';
            referencedColumns: ['id'];
          },
        ];
      };
      variants: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
          product_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
          product_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'variants_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      warehouses: {
        Row: {
          created_at: string;
          id: string;
          organisation_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organisation_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organisation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'warehouses_organisation_id_fkey';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_organisation: {
        Args: {
          p_org_name: string;
          p_stripe_customer_id: string;
          p_stripe_subscription_id: string;
          p_trial_available: boolean;
          p_user_email: string;
          p_user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      billing_status: 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled';
      organisation_user_status: 'invited' | 'active' | 'suspended' | 'removed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      billing_status: ['incomplete', 'trialing', 'active', 'past_due', 'canceled'],
      organisation_user_status: ['invited', 'active', 'suspended', 'removed'],
    },
  },
} as const;
