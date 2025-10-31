import Select from './Select';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  argTypes: {
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    label: 'Choose an option',
  },
};

export const WithLabel: Story = {
  args: {
    options: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
    label: 'Favorite Fruit',
    placeholder: 'Pick your favorite',
  },
};

export const WithError: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    label: 'With Error',
    placeholder: 'Select an option',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    label: 'Disabled Select',
    placeholder: 'Cannot select',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    label: 'Required Field',
    placeholder: 'Select an option',
    required: true,
  },
};

export const WithObjects: Story = {
  args: {
    options: [
      { id: '1', name: 'First Option', value: 'first' },
      { id: '2', name: 'Second Option', value: 'second' },
      { id: '3', name: 'Third Option', value: 'third' },
    ],
    getOptionLabel: (option: any) => option.name,
    getOptionValue: (option: any) => option.id,
    label: 'Select from Objects',
    placeholder: 'Choose one',
  },
};
