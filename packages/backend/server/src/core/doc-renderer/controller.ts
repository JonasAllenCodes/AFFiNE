import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DocNotFound, URLHelper } from '../../fundamentals';
import { DocManager } from '../doc';
import { PermissionService } from '../permission';
import { PageDocContent, PageDocContentType } from '../utils/blocksuite';

interface RenderOptions {
  og: boolean;
  content: boolean;
}

@Controller('/workspace/:workspaceId/:docId')
export class DocRendererController {
  constructor(
    private readonly doc: DocManager,
    private readonly permission: PermissionService,
    private readonly url: URLHelper
  ) {}

  @Get()
  async render(
    @Res() res: Response,
    @Param('workspaceId') workspaceId: string,
    @Param('docId') docId: string
  ) {
    if (workspaceId === docId) {
      throw new DocNotFound({ workspaceId, docId });
    }

    // if page is public, show all
    // if page is private, but workspace public og is on, show og but not content
    const opts: RenderOptions = {
      og: false,
      content: false,
    };
    const isPagePublic = await this.permission.isPublicPage(workspaceId, docId);

    if (isPagePublic) {
      opts.og = true;
      opts.content = true;
    } else {
      const allowPreview = await this.permission.allowUrlPreview(workspaceId);

      if (allowPreview) {
        opts.og = true;
      }
    }

    let docContent = opts.og
      ? await this.doc.getPageContent(workspaceId, docId)
      : null;
    if (!docContent) {
      docContent = { title: 'untitled', summary: '', content: [] };
    }

    res.setHeader('Content-Type', 'text/html');
    if (!opts.og) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }
    res.send(this._render(workspaceId, docContent, opts));
  }

  _render(
    workspaceId: string,
    doc: PageDocContent,
    { og, content }: RenderOptions
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.title} | AFFiNE</title>
          <meta name="theme-color" content="#fafafa" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" sizes="192x192" href="/favicon-192.png" />
          ${!og ? '<meta name="robots" content="noindex, nofollow" />' : ''}
          <meta
            name="twitter:title"
            content="AFFiNE: There can be more than Notion and Miro."
          />
          <meta name="twitter:description" content="${doc.title}" />
          <meta name="twitter:site" content="@AffineOfficial" />
          <meta name="twitter:image" content="https://affine.pro/og.jpeg" />
          <meta property="og:title" content="${doc.title}" />
          <meta property="og:description" content="${doc.summary}" />
          <meta property="og:image" content="https://affine.pro/og.jpeg" />
        </head>
        <body>
          <header><h1>${doc.title}</h1></header>
          <main>
            ${content ? doc.content.map(block => this._renderContent(workspaceId, block)).join('') : `<p>${doc.summary}</p>`}
          </main>
        </body>
      </html>
    `;
  }

  _renderContent(workspaceId: string, content: PageDocContentType): string {
    switch (content.type) {
      case 'affine:paragraph':
        return content.variant === 'text'
          ? `<p>${content.text}</p>`
          : `<${content.variant}>${content.text}</${content.variant}>`;
      case 'affine:list':
        return `<li>${content.text}</li>`;
      case 'affine:code':
        return `<pre>${content.text}</pre>`;
      case 'affine:image': {
        const link = this.url.link(
          `/api/workspace/${workspaceId}/blobs/${content.blobId}`
        );
        return `<img src="${link}" alt="${content.alt}" />`;
      }
      default:
        return '';
    }
  }
}
