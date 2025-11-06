import DateRangePicker from './DateRangePicker';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DateRangePicker> = {
  title: 'DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    startText: {
      control: 'text',
      defaultValue: 'Start date',
    },
    endText: {
      control: 'text',
      defaultValue: 'End date',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    startText: 'Start date',
    endText: 'End date',
  },
};

export const CustomLabels: Story = {
  args: {
    startText: 'From',
    endText: 'To',
  },
};

