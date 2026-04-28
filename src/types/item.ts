export interface Item {
  Oid: string;
  Code: string;
  Label: string;
  ItemType: string;
  ItemTypeName?: string;
  ItemGroup: string;
  ItemGroupName?: string;
  ItemAccountGroup: string;
  ItemAccountGroupName?: string;
  ItemUnit: string;
  ItemUnitName?: string;
  IsActive: boolean | string;
  Company?: string;
  CompanyName?: string;
  Balance?: number | null;
}

export interface ItemFormData {
  Label: string;
  IsActive: string;
}

export interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
}
