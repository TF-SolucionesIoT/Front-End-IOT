'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfileSettingsPage() {
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar-1'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account details.</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt="User avatar"
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription>
                This is your public display name.
              </CardDescription>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
            className="grid gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} type="button">
                  Edit Profile
                </Button>
              )}
              <Button variant="outline">Change Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
