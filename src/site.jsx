import { useEffect, useState } from 'react'

export const PHONE = '01732-126333'
export const PHONE_TEL = '+8801732126333'
export const PHONE_2 = '01767-940141'
export const PHONE_2_TEL = '+8801767940141'
export const WHATSAPP = 'https://wa.me/8801732126333'
export const FACEBOOK =
  'https://www.facebook.com/p/Muscle-Power-Gym-Chittagong-100048470155690/'
export const MAPS =
  'https://www.google.com/maps/search/?api=1&query=22.3331929,91.7887957'
export const MAP_EMBED =
  'https://maps.google.com/maps?q=22.3331929,91.7887957&z=16&output=embed'

const OPEN_HOUR = 7
const CLOSE_HOUR = 23

export const hours = [
  ['Saturday', '7:00 AM – 11:00 PM'],
  ['Sunday', '7:00 AM – 11:00 PM'],
  ['Monday', '7:00 AM – 11:00 PM'],
  ['Tuesday', '7:00 AM – 11:00 PM'],
  ['Wednesday', '7:00 AM – 11:00 PM'],
  ['Thursday', '7:00 AM – 11:00 PM'],
  ['Friday', 'Closed'],
]

export const features = [
  {
    title: 'Strength training',
    text: 'Benches, squat racks, plates, cable stations, and plate-loaded machines for every muscle group.',
    icon: <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />,
  },
  {
    title: 'Cardio zone',
    text: 'A full line of treadmills for warm-ups, fat loss, and conditioning work.',
    icon: <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />,
  },
  {
    title: 'Ladies’ hours',
    text: 'From 2:30 PM to 5:00 PM the floor is reserved for female members.',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
]

export const steps = [
  {
    title: 'Call or WhatsApp',
    text: `Reach us on ${PHONE} and ask about fees, timings, or a trial day.`,
  },
  {
    title: 'Visit the floor',
    text: 'Come to the top floor above Rangs eMart and see the equipment for yourself.',
  },
  {
    title: 'Start training',
    text: 'Sign up at the front desk, bring the required kit, and train Saturday to Thursday.',
  },
]

export const dressCode = [
  {
    title: 'T-shirts',
    text: 'Bring 2 T-shirts. Shirts and sleeveless undershirts are not allowed.',
    bn: '২টি টি-শার্ট আনতে হবে। শার্ট বা স্যান্ডো গেঞ্জি পরা যাবে না।',
  },
  {
    title: 'Trousers or shorts',
    text: 'Wear trousers or shorts. Jeans and gabardine pants are not allowed.',
    bn: 'ট্রাউজার অথবা শর্ট প্যান্ট পরতে হবে। জিন্স বা গ্যাবার্ডিন প্যান্ট গ্রহণযোগ্য নয়।',
  },
  {
    title: 'Towel',
    text: 'A towel is mandatory. You cannot work out without one.',
    bn: 'টাওয়াল অবশ্যই সঙ্গে আনতে হবে। টাওয়াল ছাড়া workout করা যাবে না।',
  },
  {
    title: 'Sneakers',
    text: 'Bring clean, soft-soled sneakers in your bag. Dirty or already-used sneakers are not accepted.',
    bn: 'পরিষ্কার, নরম সোলের কেডস ব্যাগে করে আনতে হবে। অপরিষ্কার বা ব্যবহৃত কেডস গ্রহণযোগ্য নয়।',
  },
  {
    title: 'Water bottle',
    text: 'Bring your own water bottle.',
    bn: 'পানির বোতল অবশ্যই সঙ্গে আনতে হবে।',
  },
  {
    title: 'Body spray',
    text: 'Bring body spray so you can stay fresh through the session.',
    bn: 'ব্যক্তিগত পরিচ্ছন্নতার জন্য বডি স্প্রে সঙ্গে আনতে হবে।',
  },
]

export const ruleGroups = [
  {
    title: 'Opening hours',
    items: [
      'The gym is open from 7:00 AM to 11:00 PM.',
      'From 2:30 PM to 5:00 PM the floor is reserved for female members.',
      'The gym is closed every Friday.',
    ],
  },
  {
    title: 'Workout & equipment',
    items: [
      'Each member may use the treadmill for a maximum of 15 minutes a day.',
      'Clean sports shoes are required on the treadmill. Training barefoot is not allowed.',
      'Use a personal towel during every workout.',
      'Keep the gym clean. Shoes worn outdoors must not be worn in the workout area.',
      'After your session, return plates, dumbbells, and other equipment to their places.',
      'Training shirtless, or in jeans or gabardine trousers, is not allowed.',
      'Follow the trainer’s instructions and train as advised.',
    ],
  },
  {
    title: 'Lockers',
    items: [
      'Lockers may be used only with permission from gym management.',
      'A lost locker key is charged ৳100.',
      'Do not keep illegal or prohibited items in a locker. Management is not responsible for them.',
      'If prohibited items are found, membership may be cancelled.',
    ],
  },
  {
    title: 'Fees & attendance',
    items: [
      'Monthly fees must be paid between the 1st and the 15th of each month.',
      'A late fee of ৳200 is charged for each month a payment is carried forward.',
      'Membership is cancelled if fees stay unpaid for two consecutive months.',
      'Membership is cancelled after three consecutive months away. You must register again to return.',
      'Fees are not refunded once membership is confirmed. Review the terms before you enroll.',
      'Members who attend only three days in a month still pay the full monthly fee.',
    ],
  },
  {
    title: 'Conduct',
    items: [
      'Political discussion, obscene language, and religiously provocative remarks are not allowed.',
      'You are responsible for your phone, wallet, and other personal belongings.',
      'Every member helps keep the gym clean and the floor respectful.',
      'Report complaints or concerns directly to gym management.',
    ],
  },
  {
    title: 'Children & guests',
    items: [
      'Young children are not allowed on the premises.',
      'A guest may enter only with prior permission from gym management.',
      'Guests and visitors cannot use equipment or train without an official membership.',
    ],
  },
]

function dhakaNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  return {
    day: get('weekday'),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  }
}

export function useGymStatus() {
  const [now, setNow] = useState(dhakaNow)
  useEffect(() => {
    const id = setInterval(() => setNow(dhakaNow()), 60_000)
    return () => clearInterval(id)
  }, [])
  const open =
    now.day !== 'Friday' && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR
  const ladies =
    open &&
    (now.hour > 14 || (now.hour === 14 && now.minute >= 30)) &&
    now.hour < 17
  return { today: now.day, open, ladies }
}

export function Icon({ children, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const PhoneIcon = () => (
  <Icon size={18}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Icon>
)

export const PinIcon = () => (
  <Icon size={18}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
)

export const ChatIcon = () => (
  <Icon size={18}>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
  </Icon>
)

export const ArrowIcon = () => (
  <Icon size={18}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

export const FacebookIcon = () => (
  <Icon size={18}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Icon>
)

export const MaleIcon = () => (
  <Icon>
    <circle cx="12" cy="5.2" r="2.5" />
    <path d="M5.5 10.2h13" />
    <path d="M8 21v-2.4c0-2.3 1.8-4.1 4-4.1s4 1.8 4 4.1V21" />
  </Icon>
)

export const FemaleIcon = () => (
  <Icon>
    <circle cx="12" cy="5.2" r="2.5" />
    <path d="M12 8.1 6.8 21h10.4L12 8.1z" />
  </Icon>
)

export const workoutCharts = [
  {
    id: 'male',
    title: 'Male',
    bn: 'পুরুষ',
    days: [
      ['Saturday', 'Chest', 'Bench press, incline press, chest fly'],
      ['Sunday', 'Back', 'Lat pulldown, seated row, straight-arm pulldown'],
      ['Monday', 'Shoulders', 'Shoulder press, lateral raise, rear fly'],
      ['Tuesday', 'Arms', 'Barbell curl, triceps pushdown, hammer curl'],
      ['Wednesday', 'Legs', 'Squat, leg press, leg curl'],
      ['Thursday', 'Core & cardio', 'Plank, cable crunch, treadmill'],
    ],
  },
  {
    id: 'female',
    title: 'Female',
    bn: 'মহিলা',
    days: [
      ['Saturday', 'Legs & glutes', 'Hip thrust, squat, walking lunge'],
      ['Sunday', 'Back & shoulders', 'Lat pulldown, seated row, shoulder press'],
      ['Monday', 'Chest & arms', 'Chest press, fly, dumbbell curl'],
      ['Tuesday', 'Legs & glutes', 'Romanian deadlift, leg press, hip abduction'],
      ['Wednesday', 'Full body', 'Goblet squat, row, shoulder press'],
      ['Thursday', 'Core & cardio', 'Dead bug, cable crunch, treadmill'],
    ],
  },
]

export function Mark() {
  return (
    <img
      className="wm-logo"
      src="/images/logo-mark.png"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  )
}

export function Status({ open, ladies }) {
  return (
    <span className={`status ${open ? 'is-open' : 'is-closed'}`}>
      <span className="status-dot" />
      {open
        ? ladies
          ? 'Ladies’ hours · until 5 PM'
          : 'Open now · until 11 PM'
        : 'Closed now · opens 7 AM'}
    </span>
  )
}

export const programs = {
  'weight-gain': {
    title: 'Weight gain',
    accent: 'gain.',
    bn: 'ওজন বাড়ানোর ডায়েট ও ওয়ার্কআউট',
    lead: 'Seven meals a day and a strength-first workout to help you put on size. Your trainer sets the reps and sets for you.',
    diet: [
      ['8:00 AM', ['2 eggs', 'Bread', 'Peanut butter', 'Dates', 'Raisins']],
      ['11:00 AM', ['Fruits', 'Nuts', 'Dates']],
      ['1:30 PM', ['Rice', 'Vegetables', 'Fish', 'Chicken', 'Green salad']],
      ['5:30 PM', ['2 eggs', 'Bread', 'Peanut butter', 'Dates', 'Raisins']],
      ['8:00 PM', ['Fruits', 'Nuts', 'Dates']],
      ['10:00 PM', ['Rice', 'Vegetables', 'Fish', 'Chicken', 'Green salad']],
      ['11:45 PM', ['Milk blended with peanut butter and oats']],
    ],
    workouts: [
      {
        title: 'Part 1',
        items: [
          'Assisted pull-up',
          'Push-up',
          'Seated chest press',
          'Standing flyes',
          'Dumbbell front raise',
          'Barbell curl',
          'Bench triceps dips',
          'Wrist curl',
          'Free squat',
          'Calf raise',
          'Sit-up',
          'Reverse crunch',
        ],
      },
      {
        title: 'Part 2',
        items: [
          'Seated chest press',
          'Incline chest press',
          'Bench press',
          'Bench flyes',
          'Pullover',
          'Shoulder press machine',
          'Barbell curl',
          'Dumbbell curl',
          'Hammer curl',
          'Sit-up',
          'Calf raise',
          'Pull-up',
          'Lat pulldown',
          'Seated row',
          'Reverse-grip pulldown',
          'Dumbbell shrug',
          'Close-grip press',
          'Barbell triceps extension',
          'Dumbbell extension',
          'Push-down',
          'Wrist curl',
          'Weighted squat',
        ],
      },
    ],
    notes: [],
    next: 'weight-loss',
  },
  'weight-loss': {
    title: 'Weight loss',
    accent: 'loss.',
    bn: 'ওজন কমানোর ডায়েট ও ওয়ার্কআউট',
    lead: 'Seven light meals a day, a timed cardio circuit, and machine work to burn fat and keep muscle. Your trainer sets the reps and sets for you.',
    diet: [
      ['8:00 AM', ['1 egg', '3 spoons instant oats', '1 glass low-fat milk']],
      ['11:00 AM', ['10 almonds']],
      ['1:30 PM', ['1 cup rice', '2 pcs fish or chicken', 'Steamed vegetables']],
      ['5:30 PM', ['1 orange', '2 egg whites']],
      ['8:00 PM', ['10 almonds']],
      ['10:00 PM', ['1 cup sour yogurt', 'Green salad', '2 pcs fish or chicken']],
      ['11:45 PM', ['5 almonds', '1 glass low-fat milk']],
    ],
    workouts: [
      {
        title: 'Warm-up & circuit',
        groups: [
          ['Treadmill · 15 min', 'Stretching · 5 min'],
          ['Push-up', 'Jumping jack'],
          ['Squat hold · 1 min'],
          ['Alternating reverse lunge', 'Fast feet'],
          ['Plank · 1 min', 'Jumping lunge'],
          ['Bicycle crunch', 'Burpees'],
          ['Cycling', 'Cross trainer', 'Twister'],
        ],
      },
      {
        title: 'Machine work',
        items: [
          'Machine flat chest press',
          'Close-grip lat pulldown',
          'Machine front press',
          'Barbell front press',
          'Dumbbell front press',
          'Leg press',
          'Leg squat',
          'Dumbbell squat',
          'Barbell curl',
          'Dumbbell triceps extension',
          'EZ-bar triceps extension',
          'Cable triceps extension',
          'Barbell wrist curl',
        ],
      },
    ],
    notes: [
      'Rest 1 to 1½ minutes between each pair of exercises.',
      'Use a stopwatch to time each exercise.',
    ],
    next: 'weight-gain',
  },
}
