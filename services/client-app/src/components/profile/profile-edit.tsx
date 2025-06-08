import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserPen } from 'lucide-react'
import { useUpdateProfile, useUser } from '@/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Form validation schema remains the same
const profileFormSchema = z.object({
  bio: z.string().max(500, {
    message: 'Bio must be 500 characters or less',
  }),
  socialLinks: z.object({
    github: z
      .string()
      .url({ message: 'Please enter a valid URL' })
      .regex(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/, {
        message: 'Please enter a valid GitHub URL',
      })
      .optional()
      .or(z.literal('')),
    linkedin: z
      .string()
      .url({ message: 'Please enter a valid URL' })
      .regex(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/, {
        message: 'Please enter a valid LinkedIn URL',
      })
      .optional()
      .or(z.literal('')),
    youtube: z
      .string()
      .url({ message: 'Please enter a valid URL' })
      .regex(
        /^https?:\/\/(www\.)?(youtube\.com\/(channel|c|user)\/|youtu\.be\/)[a-zA-Z0-9_-]+\/?$/,
        {
          message: 'Please enter a valid YouTube URL',
        },
      )
      .optional()
      .or(z.literal('')),
    website: z
      .string()
      .url({ message: 'Please enter a valid URL' })
      .optional()
      .or(z.literal('')),
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileEditProps {
  userId: string
  trigger?: React.ReactNode
}

export function ProfileEdit({ userId, trigger }: ProfileEditProps) {
  const [open, setOpen] = useState(false)
  const { data: user } = useUser(userId)
  const updateProfile = useUpdateProfile()

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: user?.bio || '',
      socialLinks: {
        github: user?.socialLinks?.github || '',
        linkedin: user?.socialLinks?.linkedin || '',
        youtube: user?.socialLinks?.youtube || '',
        website: user?.socialLinks?.website || '',
      },
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        bio: user.bio || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          youtube: user.socialLinks?.youtube || '',
          website: user.socialLinks?.website || '',
        },
      })
    }
  }, [form, user])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Clean up empty social links
      const socialLinks = Object.fromEntries(
        Object.entries(data.socialLinks).filter(([_, value]) => value !== ''),
      )

      await updateProfile.mutateAsync({
        bio: data.bio,
        socialLinks:
          Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      })

      toast('Success', {
        description: 'Your profile has been updated.',
      })

      setOpen(false)
    } catch (error) {
      toast('Error', {
        description: 'Failed to update your profile. Please try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPen className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and social media links.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={user?.bio || 'Tell us about yourself'}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short bio about yourself.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        user?.socialLinks?.github ||
                        'https://github.com/username'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        user?.socialLinks?.linkedin ||
                        'https://linkedin.com/in/username'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Channel</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        user?.socialLinks?.youtube ||
                        'https://youtube.com/channel/UC123456789'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        user?.socialLinks?.website || 'https://mywebsite.com'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
