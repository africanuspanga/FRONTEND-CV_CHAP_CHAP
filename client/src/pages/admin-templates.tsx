import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  usage_count: number;
}

const AdminTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    thumbnail: '',
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // This would be the real API call
        // const response = await fetch('/api/admin/templates', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        //   }
        // });
        // const data = await response.json();
        // setTemplates(data.templates);
        
        // Using mock data for now
        setTimeout(() => {
          setTemplates([
            {
              id: '1',
              name: 'Professional CV',
              description: 'A clean and professional CV template suited for corporate environments.',
              thumbnail: '/templates/professional-cv-thumb.jpg',
              usage_count: 125
            },
            {
              id: '2',
              name: 'Creative CV',
              description: 'A colorful and bold template for creative professionals.',
              thumbnail: '/templates/creative-cv-thumb.jpg',
              usage_count: 87
            },
            {
              id: '3',
              name: 'Academic CV',
              description: 'A comprehensive template focusing on educational achievements and publications.',
              thumbnail: '/templates/academic-cv-thumb.jpg',
              usage_count: 64
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This would be the real API call
      // const response = await fetch('/api/admin/templates', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      //   },
      //   body: JSON.stringify(newTemplate)
      // });
      // const data = await response.json();
      // setTemplates([...templates, data.template]);
      
      // Simulating the API call
      const mockNewTemplate = {
        ...newTemplate,
        id: `${Date.now()}`,
        usage_count: 0
      };
      setTemplates([...templates, mockNewTemplate]);
      setNewTemplate({ name: '', description: '', thumbnail: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding template:', error);
    }
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    try {
      // This would be the real API call
      // const response = await fetch(`/api/admin/templates/${selectedTemplate.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      //   },
      //   body: JSON.stringify(selectedTemplate)
      // });
      // const data = await response.json();
      
      // Simulating the API call
      const updatedTemplates = templates.map(template =>
        template.id === selectedTemplate.id ? selectedTemplate : template
      );
      setTemplates(updatedTemplates);
      setSelectedTemplate(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      // This would be the real API call
      // await fetch(`/api/admin/templates/${templateId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      //   }
      // });
      
      // Simulating the API call
      const filteredTemplates = templates.filter(template => template.id !== templateId);
      setTemplates(filteredTemplates);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Template</DialogTitle>
                <DialogDescription>
                  Create a new CV template for users to choose from.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={newTemplate.thumbnail}
                    onChange={(e) => setNewTemplate({ ...newTemplate, thumbnail: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Template</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogDescription>
                  Update the template details.
                </DialogDescription>
              </DialogHeader>
              {selectedTemplate && (
                <form onSubmit={handleUpdateTemplate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Template Name</Label>
                    <Input
                      id="edit-name"
                      value={selectedTemplate.name}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={selectedTemplate.description}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                    <Input
                      id="edit-thumbnail"
                      value={selectedTemplate.thumbnail}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, thumbnail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Template</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Thumbnail
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Used {template.usage_count} times
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTemplatesPage;
