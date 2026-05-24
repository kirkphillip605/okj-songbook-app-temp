import React from 'react';
import { Popover, List, ListItem, Icon } from 'framework7-react';

const PERF_TYPES = [
  { key: 'solo', label: 'Solo', icon: 'person_fill' },
  { key: 'duet', label: 'Duet', icon: 'person_2_fill' },
  { key: 'group', label: 'Group', icon: 'person_3_fill' },
];

/**
 * Popover that lets the user pick a performance type.
 * Props:
 *   opened   – boolean, whether the popover is open
 *   onClose  – callback when popover is closed
 *   onSelect – (typeKey) => void called when a type is chosen
 */
export default function PerformanceTypePopover({ opened, onClose, onSelect, targetEl }) {
  return (
    <Popover
      opened={opened}
      onPopoverClosed={onClose}
      targetEl={targetEl}
      className="performance-type-popover"
    >
      <List>
        {PERF_TYPES.map((type) => (
          <ListItem
            key={type.key}
            link
            onClick={() => {
              onSelect(type.key);
            }}
          >
            <Icon slot="media" f7={type.icon} />
            {type.label}
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}
