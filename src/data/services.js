/* Repair services shown on the Repair Services page and in the enquiry forms.
 * No prices here on purpose — Leon quotes after assessing each item. */
module.exports = [
  {
    id: 'large', name: 'Large Appliances', image: 'site/fridge-delivery',
    intro: 'Fridges, washers and cookers that keep a household running. Bring them in, or ask about a house call.',
    items: [
      { name: 'Fridges', icon: 'fridge', desc: 'Not cooling, noisy compressors, leaking water, faulty thermostats and door seals.' },
      { name: 'Freezers', icon: 'freezer', desc: 'Chest and upright freezers that ice up, run constantly or stop freezing.' },
      { name: 'Washing machines', icon: 'washer', desc: 'Won’t spin, won’t drain, leaks, door locks, motors and pumps.' },
      { name: 'Tumble dryers', icon: 'dryer', desc: 'No heat, drum not turning, worn belts and sensor faults.' },
      { name: 'Dishwashers', icon: 'dishwasher', desc: 'Not cleaning, not draining, error codes and water leaks.' },
      { name: 'Stoves', icon: 'stove', desc: 'Plates not heating, switches, wiring and gas-electric hybrids.' },
      { name: 'Ovens and hobs', icon: 'oven', desc: 'Elements, thermostats, fans and controls on built-in units.' },
    ],
  },
  {
    id: 'small', name: 'Small Appliances', image: 'site/microwave-repair',
    intro: 'Everyday kitchen and home appliances that are often worth fixing rather than replacing.',
    items: [
      { name: 'Microwaves', icon: 'microwave', desc: 'No heat, turntable not turning, sparking, dead panels.' },
      { name: 'Kettles', icon: 'kettle', desc: 'Won’t switch on, won’t switch off, faulty bases.' },
      { name: 'Blenders', icon: 'blender', desc: 'Motor faults, worn couplings and switch problems.' },
      { name: 'Mixers', icon: 'mixer', desc: 'Stand and hand mixers with speed or motor faults.' },
      { name: 'Air fryers', icon: 'airfryer', desc: 'Not heating, fan faults, timers and controls.' },
      { name: 'Vacuum cleaners', icon: 'vacuum', desc: 'Weak suction, motor and cable faults, blockages.' },
      { name: 'Toasters', icon: 'toaster', desc: 'Elements, levers and browning controls.' },
    ],
  },
  {
    id: 'electronics', name: 'Electronics', image: 'site/testing-board',
    intro: 'Screens, sound and selected devices assessed on the bench.',
    items: [
      { name: 'Televisions', icon: 'tv', desc: 'No power, no picture, sound but no image, board faults.' },
      { name: 'Speakers', icon: 'speaker', desc: 'Crackling, no sound, blown drivers and Bluetooth faults.' },
      { name: 'Audio equipment', icon: 'music', desc: 'Amplifiers, receivers, hi-fi systems and sound bars.' },
      { name: 'Selected electronic devices', icon: 'cpu', desc: 'Ask Leon whether your device can be assessed.' },
    ],
  },
  {
    id: 'tools', name: 'Power Tools', image: 'site/tool-demo',
    intro: 'Workshop and DIY tools brought back to working order.',
    items: [
      { name: 'Drills', icon: 'drill', desc: 'Corded and cordless drills, chucks, switches and brushes.' },
      { name: 'Grinders', icon: 'disc', desc: 'Angle grinders with motor, brush or switch faults.' },
      { name: 'Circular saws', icon: 'saw', desc: 'Motor faults, guards, switches and bearings.' },
      { name: 'Other repairable equipment', icon: 'hammer', desc: 'Sanders, jigsaws, compressors and more. Just ask.' },
    ],
  },
];
