import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerService } from './crawler.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CrawlerService', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crawlUrl', () => {
    it('should return a search result when the keyword is found in the page text', async () => {
      // Arrange
      const url = 'https://example.com';
      const keyword = 'Success';
      const fakeHtml = `
        <html lang="">
          <body>
            <div>Some other text</div>
            <p>Here is a message of Success!</p>
          </body>
        </html>
      `;

      mockedAxios.get.mockResolvedValue({ data: fakeHtml });

      // Act
      const result = await service.crawlUrl(url, keyword);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.url).toBe(url);
      expect(result?.snippet).toBe('Here is a message of Success!');
      expect(mockedAxios.get).toHaveBeenCalledWith(url, expect.any(Object));
    });

    it('should return null when the keyword is not found', async () => {
      // Arrange
      const url = 'https://example.com';
      const keyword = 'NotFound';
      const fakeHtml = `
        <html lang="">
          <body>
            <p>This page contains other content.</p>
          </body>
        </html>
      `;
      mockedAxios.get.mockResolvedValue({ data: fakeHtml });

      // Act
      const result = await service.crawlUrl(url, keyword);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when the keyword is only in HTML tags or scripts', async () => {
      // Arrange
      const url = 'https://example.com';
      const keyword = 'hidden';
      const fakeHtml = `
        <html>
          <body>
            <script>var config = { hidden: true };</script>
            <div className="content-hidden">Just some text</div>
          </body>
        </html>
      `;
      mockedAxios.get.mockResolvedValue({ data: fakeHtml });

      // Act
      const result = await service.crawlUrl(url, keyword);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if axios throws an error', async () => {
      // Arrange
      const url = 'https://failing-site.com';
      const keyword = 'any';
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      // Act
      const result = await service.crawlUrl(url, keyword);

      // Assert
      expect(result).toBeNull();
    });
  });
});