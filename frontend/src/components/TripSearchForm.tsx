import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const genres = [
  { id: 1, name: '観光' },
  { id: 2, name: 'グルメ' },
  { id: 3, name: 'アクティビティ' },
  { id: 4, name: '温泉' },
  { id: 5, name: 'ショッピング' },
] as const;

const searchFormSchema = z.object({
  title: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  genres: z.array(z.number()).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export function TripSearchForm() {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      title: '',
      dateRange: { from: undefined, to: undefined },
      genres: [],
    },
  });

  function onSubmit(data: SearchFormValues) {
    console.log('Search criteria:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
        {/* タイトル検索 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="プラン名で検索..." className="pl-8" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* 日付範囲選択 */}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" size="sm" className="h-10">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        <>
                          {format(field.value.from, 'MM/dd')}
                          {field.value.to ? ` - ${format(field.value.to, 'MM/dd')}` : ''}
                        </>
                      ) : (
                        <span>日付</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="range" onSelect={field.onChange} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* ジャンル選択 */}
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    ジャンル
                    {field.value?.length ? (
                      <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                        {field.value.length}
                      </span>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="ジャンルを検索" />
                    <CommandList>
                      {genres.map((genre) => (
                        <CommandItem
                          key={genre.id}
                          onSelect={() => {
                            if (field.value?.includes(genre.id)) {
                              field.onChange(field.value.filter((id) => id !== genre.id));
                            } else {
                              field.onChange([...(field.value || []), genre.id]);
                            }
                          }}
                        >
                          {genre.name}
                          {field.value?.includes(genre.id) && <X className="ml-auto h-4 w-4 text-muted-foreground" />}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" className="h-10">
          検索
        </Button>
      </form>
    </Form>
  );
}
