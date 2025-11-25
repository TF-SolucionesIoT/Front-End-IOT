'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Phone, Plus, Edit, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getEmergencyContactsByPatient,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  type EmergencyContact,
  type CreateEmergencyContactRequest,
} from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    connection: '',
  });
  const { toast } = useToast();

  // Get current user's patientId from localStorage
  const getCurrentPatientId = (): number => {
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('user_profile');
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          return profile.id || 1;
        } catch (e) {
          console.error('Error parsing user profile:', e);
        }
      }
    }
    return 1; // Default fallback
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const patientId = getCurrentPatientId();
      const data = await getEmergencyContactsByPatient(patientId);
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load emergency contacts',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleOpenDialog = (contact?: EmergencyContact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        connection: contact.connection || '',
      });
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        phoneNumber: '',
        connection: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phoneNumber: '',
      connection: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingContact) {
        // Update existing contact
        await updateEmergencyContact(editingContact.id!, {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          connection: formData.connection,
        });
        toast({
          title: 'Success',
          description: 'Contact updated successfully',
        });
      } else {
        // Create new contact
        const patientId = getCurrentPatientId();
        const newContact: CreateEmergencyContactRequest = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          connection: formData.connection,
          patientId,
        };
        console.log('Creating contact with data:', newContact);
        await createEmergencyContact(newContact);
        toast({
          title: 'Success',
          description: 'Contact created successfully',
        });
      }
      
      handleCloseDialog();
      loadContacts();
    } catch (error: any) {
      console.error('Error saving contact:', error);
      
      let errorMessage = `Failed to ${editingContact ? 'update' : 'create'} contact`;
      
      if (error?.status === 403) {
        errorMessage = 'Access denied. Please check your authentication token.';
      } else if (error?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error?.details?.message) {
        errorMessage = error.details.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await deleteEmergencyContact(id);
      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
      });
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete contact',
      });
    }
  };

  const handleCall = (contact: EmergencyContact) => {
    if (contact.phoneNumber) {
      window.location.href = `tel:${contact.phoneNumber}`;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Caregivers & Contacts</CardTitle>
              <CardDescription>
                People who can help in an emergency.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingContact ? 'Edit Contact' : 'Add Contact'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingContact
                      ? 'Update the contact information.'
                      : 'Add a new contact for emergencies.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter contact name"
                        required
                        maxLength={20}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="connection">Connection</Label>
                      <Input
                        id="connection"
                        value={formData.connection}
                        onChange={(e) =>
                          setFormData({ ...formData, connection: e.target.value })
                        }
                        placeholder="e.g., Daughter, Doctor, Friend"
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingContact ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No contacts added yet. Add one to get started.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {contacts.map((contact) => {
                const avatar = PlaceHolderImages[0];
                return (
                  <div key={contact.id} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      {avatar && (
                        <AvatarImage
                          src={avatar.imageUrl}
                          alt={contact.name}
                          data-ai-hint={avatar.imageHint}
                        />
                      )}
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.connection || 'Contact'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCall(contact)}
                        title="Call contact"
                      >
                        <Phone className="h-5 w-5 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(contact)}
                        title="Edit contact"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id!)}
                        title="Delete contact"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
