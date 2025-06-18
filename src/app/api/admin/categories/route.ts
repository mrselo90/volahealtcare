import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Admin categories API - Session:', session?.user?.email, 'Role:', session?.user?.role);
    
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Unauthorized access to admin categories API');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    // Return full JSON string for name and description, not just English value
    const transformed = categories.map(category => ({
      id: category.id,
      name: category.name, // JSON string
      description: category.description, // JSON string
      slug: category.slug,
      imageUrl: category.imageUrl,
      orderIndex: category.orderIndex,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      // Validate file type and size
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be less than 2MB.' }, { status: 400 });
      }
      // Save the file to disk
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public/uploads/categories');
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/categories/${fileName}`;
    }

    // Parse and validate the name
    let nameData = { en: '' };
    try {
      if (name.startsWith('{')) {
        // Try to parse as JSON
        const parsed = JSON.parse(name);
        // If parsing succeeds, ensure we have at least an English name
        if (parsed && typeof parsed === 'object') {
          nameData = { ...parsed, en: parsed.en || '' };
        } else {
          nameData = { en: String(parsed || '') };
        }
      } else {
        // If it's a plain string, use it as the English name
        nameData = { en: name };
      }
      
      // Ensure we always have a string for English name
      if (!nameData.en) {
        nameData.en = '';
      }
    } catch (e) {
      console.error('Error parsing name:', e);
      // Fallback to empty English name if parsing fails
      nameData = { en: String(name || '') };
    }

    // Get the highest orderIndex
    const lastCategory = await (prisma as any).category.findFirst({
      orderBy: { orderIndex: 'desc' },
    });
    const orderIndex = lastCategory ? lastCategory.orderIndex + 1 : 0;

    // Stringify the name object before saving to the database
    const category = await (prisma as any).category.create({
      data: {
        name: JSON.stringify(nameData),
        description: description ? description : '{}',
        slug,
        orderIndex,
        ...(imageUrl && { imageUrl })
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (
      error.code === 'P2002' &&
      error.meta &&
      Array.isArray(error.meta.target) &&
      error.meta.target.includes('slug')
    ) {
      return NextResponse.json(
        { error: 'A category with this slug already exists.' },
        { status: 409 }
      );
    }
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imageUrl;
    if (imageFile && imageFile.size > 0) {
      // Validate file type and size
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be less than 2MB.' }, { status: 400 });
      }
      // Save the file to disk
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public/uploads/categories');
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/categories/${fileName}`;
      // Delete old image if it exists and is not used by other categories
      const prevCategory = await (prisma as any).category.findUnique({ where: { id } });
      if (prevCategory && prevCategory.imageUrl && prevCategory.imageUrl !== imageUrl) {
        const count = await (prisma as any).category.count({ where: { imageUrl: prevCategory.imageUrl, NOT: { id } } });
        if (count === 0) {
          const prevPath = path.join(process.cwd(), 'public', prevCategory.imageUrl);
          try {
            await fs.unlink(prevPath);
          } catch (e) {
            // Ignore file not found or deletion errors
          }
        }
      }
    }

    // Parse and validate the name
    let nameData = { en: '' };
    try {
      if (name.startsWith('{')) {
        // Try to parse as JSON
        const parsed = JSON.parse(name);
        // If parsing succeeds, ensure we have at least an English name
        if (parsed && typeof parsed === 'object') {
          nameData = { ...parsed, en: parsed.en || '' };
        } else {
          nameData = { en: String(parsed || '') };
        }
      } else {
        // If it's a plain string, use it as the English name
        nameData = { en: name };
      }
      
      // Ensure we always have a string for English name
      if (!nameData.en) {
        nameData.en = '';
      }
    } catch (e) {
      console.error('Error parsing name:', e);
      // Fallback to empty English name if parsing fails
      nameData = { en: String(name || '') };
    }

    const updateData: any = {
      name: JSON.stringify(nameData),
      slug,
      description: description ? description : '{}',
      ...(imageUrl && { imageUrl })
    };

    const category = await (prisma as any).category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (
      error.code === 'P2002' &&
      error.meta &&
      Array.isArray(error.meta.target) &&
      error.meta.target.includes('slug')
    ) {
      return NextResponse.json(
        { error: 'A category with this slug already exists.' },
        { status: 409 }
      );
    }
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category has services
    const services = await (prisma as any).service.findMany({
      where: { categoryId: id },
      select: { id: true, title: true },
    });

    if (services.length > 0) {
      if (!force) {
        return NextResponse.json(
          { 
            error: 'Cannot delete category with linked services.',
            services,
            message: 'Use ?force=true to delete anyway and remove all services',
          },
          { status: 400 }
        );
      } else {
        // If force=true, the cascade delete will automatically remove all services and related data
        // when we delete the category below
      }
    }

    await (prisma as any).category.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true,
      message: force ? 'Category and all linked services deleted' : 'Category deleted'
    });
  } catch (error: unknown) {
    console.error('Error deleting category:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to delete category',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
