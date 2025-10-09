import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const caregivers = [
  { name: 'Maria Garcia', relation: 'Daughter', avatarId: 'user-avatar-1' },
  { name: 'Dr. Smith', relation: 'Primary Doctor', avatarId: 'user-avatar-1' },
];

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Caregivers & Contacts</CardTitle>
          <CardDescription>
            People who can help in an emergency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {caregivers.map((caregiver, index) => {
              const avatar = PlaceHolderImages.find(
                (img) => img.id === caregiver.avatarId
              );
              return (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {avatar && (
                      <AvatarImage
                        src={avatar.imageUrl}
                        alt={caregiver.name}
                        data-ai-hint={avatar.imageHint}
                      />
                    )}
                    <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold">{caregiver.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {caregiver.relation}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
