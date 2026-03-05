const categoryColors: { [key: string]: string } = {
        "Referral and Intake" :'bg-[#FFC7DC]',
        "Phone" :'bg-[#DAFEBE]' ,
        "Face to Face":'bg-[#CAC7FF]',
        "Team Meeting":'bg-[#FFE9A7]',
        "Individual Meeting":'bg-[#EDD4FF]',
        "Family Meeting":'bg-[#C8F8FF]',
        "Referral to Service Provider":'bg-[#FFC7DC]',
        "Employment Job Readiness":'bg-[#DAFEBE]',
        "Transportation":'bg-[#CAC7FF]',
        "Wellness Check" :'bg-[#FFE9A7]',
        "Tracking Check Up":'bg-[#EDD4FF]',
        "Advocacy":'bg-[#C8F8FF]',
        'Other': 'bg-[#D8DDE7]'

    } as const;

    export type ContactTypeKey = keyof typeof categoryColors;

export default categoryColors