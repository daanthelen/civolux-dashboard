'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import type { Address } from '@/types/map';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

interface AddressInputProps {
  onSelect: (adddress: Address) => void;
}

export function AddressInput({ onSelect }: AddressInputProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const formatAddress = (address: Address) => {
    return `${address.street} ${address.house_number}${
      address.house_number_addition || ''
    }`;
  };

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAddresses([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analysis/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: query,
        }),
      });

      const addressResult = await response.json();
      setAddresses(addressResult);
    }
    catch (error) {
      console.error(error);
      setAddresses([]);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  }, [searchQuery, searchAddress]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {value || 'Search address...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type at least 2 characters to search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-64">
            {isLoading && addresses.length === 0 && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Searching addresses...</span>
              </div>
            )}

            {!isLoading && searchQuery.length > 0 && searchQuery.length < 2 && (
              <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
            )}

            {!isLoading && searchQuery.length >= 2 && addresses.length === 0 && (
              <CommandEmpty>No addresses found for &quot;{searchQuery}&quot;</CommandEmpty>
            )}

            {addresses.length > 0 && (
              <CommandGroup>
                {addresses.map((address, index) => {
                  const addressString = formatAddress(address)
                  return (
                    <CommandItem
                      key={`${addressString}-${index}`}
                      value={addressString}
                      onSelect={() => {
                        setValue(addressString)
                        onSelect(address)
                        setOpen(false)
                        setSearchQuery("")
                        setAddresses([])
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === addressString ? "opacity-100" : "opacity-0")} />
                      <div className="flex flex-col">
                        <span className="font-medium">{addressString}</span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
