require('dotenv').config();
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_SECRET_API_KEY;
    this.jwt = process.env.PINATA_JWT;
    this.pinataUrl = 'https://api.pinata.cloud';
  }

  /**
   * Upload file to IPFS via Pinata
   * @param {string} filePath - Path to the file to upload
   * @param {object} metadata - Optional metadata for the file
   * @returns {Promise<object>} - IPFS hash and pin info
   */
  async uploadFile(filePath, metadata = {}) {
    try {
      if (!this.jwt && !this.apiKey) {
        console.warn('⚠️  Pinata credentials not configured. File upload disabled.');
        return { ipfsHash: 'mock_hash_' + Date.now(), success: false };
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      // Add custom metadata if provided
      if (metadata.name) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name,
          keyvalues: metadata.keyvalues || {}
        }));
      }

      // Configure pinning options
      if (metadata.pinataOptions) {
        formData.append('pinataOptions', JSON.stringify(metadata.pinataOptions));
      }

      // Use JWT for authentication (preferred method)
      const headers = this.jwt
        ? {
            'Authorization': `Bearer ${this.jwt}`,
            ...formData.getHeaders()
          }
        : {
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.apiSecret,
            ...formData.getHeaders()
          };

      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinFileToIPFS`,
        formData,
        { headers, maxContentLength: Infinity, maxBodyLength: Infinity }
      );

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('Error uploading file to Pinata:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Upload JSON data to IPFS
   * @param {object} data - JSON data to upload
   * @param {string} name - Name for the JSON object
   * @returns {Promise<object>} - IPFS hash and pin info
   */
  async uploadJSON(data, name = 'data.json') {
    try {
      if (!this.jwt && !this.apiKey) {
        console.warn('⚠️  Pinata credentials not configured. JSON upload disabled.');
        return { ipfsHash: 'mock_json_hash_' + Date.now(), success: false };
      }

      const jsonData = JSON.stringify(data);

      const headers = this.jwt
        ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.jwt}`
          }
        : {
            'Content-Type': 'application/json',
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.apiSecret
          };

      const body = {
        pinataContent: data,
        pinataMetadata: {
          name: name
        }
      };

      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinJSONToIPFS`,
        body,
        { headers }
      );

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Unpin a file from IPFS
   * @param {string} hash - IPFS hash of the file to unpin
   * @returns {Promise<boolean>} - Success status
   */
  async unpinFile(hash) {
    try {
      if (!this.jwt && !this.apiKey) {
        console.warn('⚠️  Pinata credentials not configured. Cannot unpin file.');
        return false;
      }

      const headers = this.jwt
        ? {
            'Authorization': `Bearer ${this.jwt}`
          }
        : {
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.apiSecret
          };

      await axios.delete(`${this.pinataUrl}/pinning/unpin/${hash}`, { headers });
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Test Pinata connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      if (!this.jwt && !this.apiKey) {
        return false;
      }

      const headers = this.jwt
        ? {
            'Authorization': `Bearer ${this.jwt}`
          }
        : {
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.apiSecret
          };

      const response = await axios.get(`${this.pinataUrl}/data/testAuthentication`, { headers });
      return response.status === 200;
    } catch (error) {
      console.error('Pinata connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new PinataService();

