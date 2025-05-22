import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram, ComputeBudgetProgram } from '@solana/web3.js';
import { PinataSDK } from 'pinata-web3';
import { TadContracts } from 'src/types/tad_contracts/tad_contracts';

@Injectable()
export class CarsService {
  private readonly pinata: PinataSDK;
  private readonly program: anchor.Program<TadContracts>;
  private readonly provider: anchor.AnchorProvider;
  private readonly adminWalletKeypair: Keypair;

  constructor() {
    // Initialize Pinata for IPFS uploads
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT || '',
      pinataGateway: process.env.PINATA_GATEWAY || '',
    });

    // Set up Solana connection and admin wallet
    const connection = new anchor.web3.Connection(process.env.SOLANA_CONNECTION || 'https://api.devnet.solana.com');
    this.adminWalletKeypair = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(process.env.SOLANA_WALLET_SECRET_KEY || '[]'))
    );
    const wallet = new anchor.Wallet(this.adminWalletKeypair);
    this.provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    anchor.setProvider(this.provider);

    // Load the program IDL
    const idl = require('../../../tad_contracts/target/idl/tad_contracts.json'); // Adjust path as needed
    this.program = new anchor.Program(
      idl,
      new PublicKey(process.env.SMART_CONTRACT_ADDRESS || ''),
      this.provider
    );
  }

  findAll(filters: { status?: string; dealerId?: string; search?: string }) {
    // TODO: implement filtering
    return [];
  }

  create(dto: CreateCarDto) {
    // TODO: create a car record
    return { id: 'new-id', ...dto };
  }

  findOne(id: string) {
    // TODO: lookup by id
    return { id };
  }

  update(id: string, dto: UpdateCarDto) {
    // TODO: update
    return { id, ...dto };
  }

  remove(id: string) {
    // TODO: delete
    return;
  }

   // --- PDA Derivation and Initialization Methods ---

   private async getConfigPda(): Promise<PublicKey> {
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );
    // Check if initialized, initialize if not
    try {
      await this.program.account.config.fetch(configPda);
    } catch (error) {
      console.log('Config account not found, initializing...');
      const tx = await this.program.methods
        .initializeConfig()
        .accounts({
          config: configPda,
          admin: this.adminWalletKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(`Config initialized with transaction: ${tx}`);
    }
    return configPda;
  }

  private async getDealerPda(): Promise<PublicKey> {
    const [dealerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('dealer'), this.adminWalletKeypair.publicKey.toBuffer()],
      this.program.programId
    );
    // Check if initialized, initialize if not
    try {
      await this.program.account.dealer.fetch(dealerPda);
    } catch (error) {
      console.log('Dealer account not found, initializing with name: DefaultDealer');
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 });
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });

      const tx = await this.program.methods
        .initializeDealer('DefaultDealer')
        .accounts({
          dealer: dealerPda,
          authority: this.adminWalletKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

        const blockhash = await this.provider.connection.getLatestBlockhash('confirmed');
        const blockheight =  blockhash.lastValidBlockHeight;
  
        tx.recentBlockhash = blockhash.blockhash;
        tx.lastValidBlockHeight = blockheight;
  
        tx.add(modifyComputeUnits);
        tx.add(addPriorityFee);
  
        // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed to initialize dealer.`);
    }
      
      console.log(`Dealer initialized with transaction: ${tx}`);
    }
    return dealerPda;
  }

  private async getUserPda(): Promise<PublicKey> {
    const [userPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user'), this.adminWalletKeypair.publicKey.toBuffer()],
      this.program.programId
    );
    // Check if initialized, initialize if not
    try {
      await this.program.account.user.fetch(userPda);
    } catch (error) {
      console.log('User account not found, initializing with email: admin@example.com');
      const tx = await this.program.methods
        .initializeUser('admin@example.com')
        .accounts({
          user: userPda,
          authority: this.adminWalletKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(`User initialized with transaction: ${tx}`);
    }
    return userPda;
  }

  private async getCarPda(vin: string): Promise<PublicKey> {
    const [carPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('car'), Buffer.from(vin)],
      this.program.programId
    );
    // Check if initialized, initialize if not
    try {
      await this.program.account.car.fetch(carPda);
    } catch (error) {
      console.log('Car account not found, initializing...');
      const dealerPda = await this.getDealerPda();
      console.log(`Using dealer PDA: ${dealerPda.toBase58()} for car initialization`);
      const tx = await this.program.methods
        .initializeCar(vin)
        .accounts({
          car: carPda,
          dealer: dealerPda,
          owner: this.adminWalletKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(`Car initialized with transaction: ${tx}`);
    }
    return carPda;
  }

  private async getReportDataPda(carPda: PublicKey, reportId: anchor.BN): Promise<PublicKey> {
    console.log(`Deriving report data PDA for car: ${carPda.toBase58()}, reportId: ${reportId.toString()}`);
    const [reportDataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('report_data'), carPda.toBuffer(), reportId.toArrayLike(Buffer, 'le', 8)],
      this.program.programId
    );
    console.log(`Report data PDA derived: ${reportDataPda.toBase58()}`);
    // No initialization needed here as it's created during registerServiceAttendance
    return reportDataPda;
  }

  private async getDealerReportDataPda(carPda: PublicKey, reportId: anchor.BN): Promise<PublicKey> {
    console.log(`Deriving dealer report data PDA for car: ${carPda.toBase58()}, reportId: ${reportId.toString()}`);
    const [dealerReportDataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('dealer_report_data'), carPda.toBuffer(), reportId.toArrayLike(Buffer, 'le', 8)],
      this.program.programId
    );
    console.log(`Dealer report data PDA derived: ${dealerReportDataPda.toBase58()}`);
    // No initialization needed here as it's created during getReport
    return dealerReportDataPda;
  }

  // --- Main Methods ---

  /** Retrieves car data by VIN */
  async getCarData(vin: string): Promise<any> {
    if (!vin) {
      console.error('Invalid input: vin is required');
      throw new Error('Invalid input: vin is required');
    }
    console.log(`Fetching car data for VIN: ${vin}`);
    const [carPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('car'), Buffer.from(vin)],
      this.program.programId
    );
    let carData;
    try {
      console.log(`Fetching car account data for PDA: ${carPda.toBase58()}`);
      carData = await this.program.account.car.fetch(carPda, 'finalized');
      console.log(`Raw totalKm:`, carData.totalKm);
      // Convert totalKm to decimal string
      const formattedCarData = {
        ...carData,
        totalKm: carData.totalKm.toString(10), // Force decimal
      };
      console.log(`Formatted car data: ${JSON.stringify(formattedCarData)}`);
      return formattedCarData;
    } catch (error) {
      console.error(`Failed to fetch car data for VIN: ${vin}, error: ${error.message}`);
      throw new BadRequestException(`Car doesn't exist, vin: ${vin}`);
    }
  }

   /** Retrieves report data by VIN and reportId */
   async getReportData(vin: string, reportId: number): Promise<any> {
    if (!vin || reportId == null) {
      console.error('Invalid input: vin and reportId are required');
      throw new Error('Invalid input: vin and reportId are required');
    }
    console.log(`Fetching report data for VIN: ${vin}, reportId: ${reportId}`);
    const [carPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('car'), Buffer.from(vin)],
      this.program.programId
    );
    try {
      await this.program.account.car.fetch(carPda);
    } catch (error) {
      console.error(`Failed to fetch car data for VIN: ${vin}, error: ${error.message}`);
      throw new BadRequestException(`Car doesn't exist, vin: ${vin}`);
    }
    const reportIdBn = new anchor.BN(reportId);
    const [reportDataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('report_data'), carPda.toBuffer(), reportIdBn.toArrayLike(Buffer, 'le', 8)],
      this.program.programId
    );
    let reportData;
    try {
      console.log(`Fetching report data account for PDA: ${reportDataPda.toBase58()}`);
      reportData = await this.program.account.reportData.fetch(reportDataPda, 'finalized');
      console.log(`Report data fetched: ${JSON.stringify(reportData)}`);
      return reportData;
    } catch (error) {
      console.error(`Failed to fetch report data for VIN: ${vin}, reportId: ${reportId}, error: ${error.message}`);
      throw new BadRequestException(`Report data doesn't exist for VIN: ${vin}, reportId: ${reportId}`);
    }
  }

  /** Retrieves dealer report data by VIN and reportId */
  async getDealerReportData(vin: string, reportId: number): Promise<any> {
    if (!vin || reportId == null) {
      console.error('Invalid input: vin and reportId are required');
      throw new Error('Invalid input: vin and reportId are required');
    }
    console.log(`Fetching dealer report data for VIN: ${vin}, reportId: ${reportId}`);
    const [carPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('car'), Buffer.from(vin)],
      this.program.programId
    );
    try {
      await this.program.account.car.fetch(carPda);
    } catch (error) {
      console.error(`Failed to fetch car data for VIN: ${vin}, error: ${error.message}`);
      throw new BadRequestException(`Car doesn't exist, vin: ${vin}`);
    }
    const reportIdBn = new anchor.BN(reportId);
    const [dealerReportDataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('dealer_report_data'), carPda.toBuffer(), reportIdBn.toArrayLike(Buffer, 'le', 8)],
      this.program.programId
    );
    let dealerReportData;
    try {
      console.log(`Fetching dealer report data account for PDA: ${dealerReportDataPda.toBase58()}`);
      dealerReportData = await this.program.account.dealerReportData.fetch(dealerReportDataPda, 'finalized');
      console.log(`Dealer report data fetched: ${JSON.stringify(dealerReportData)}`);
      return dealerReportData;
    } catch (error) {
      console.error(`Failed to fetch dealer report data for VIN: ${vin}, reportId: ${reportId}, error: ${error.message}`);
      throw new BadRequestException(`Dealer report data doesn't exist for VIN: ${vin}, reportId: ${reportId}`);
    }
  }

  /** Retrieves user data from the blockchain */
  async getUserData(): Promise<any> {
    const [userPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user'), this.adminWalletKeypair.publicKey.toBuffer()],
      this.program.programId
    );
    try {
      const userData = await this.program.account.user.fetch(userPda, 'finalized');
      const formattedUserData = {
        ...userData,
        points: userData.points.toString(10), // Force decimal
      };
      console.log(`Formatted car data: ${JSON.stringify(formattedUserData)}`);
      return formattedUserData;
    } catch (error) {
      console.error(`Failed to fetch user data: ${error.message}`);
      throw new BadRequestException('User account does not exist');
    }
  }

  /** Registers kilometers for a car */
  async registerCarKm(vin: string, km: number): Promise<string> {
    console.log(`Registering car kilometers for VIN: ${vin}, KM: ${km}`);
    const carPda = await this.getCarPda(vin);
    console.log(`Calling registerCarKm with car PDA: ${carPda.toBase58()}`);
    // Define compute unit and priority fee instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000, // Standard for token transfers
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000, // 0.1 micro-lamports per compute unit
    });

    const tx = await this.program.methods
      .registerCarKm(new anchor.BN(km))
      .accounts({
        car: carPda,
        owner: this.adminWalletKeypair.publicKey,
      })
      .transaction();
    
    // Set blockhash and block height
    const { blockhash, lastValidBlockHeight } = await this.provider.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    // Add compute units and priority fee
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed to register car kilometers for VIN: ${vin}, KM: ${km}`);
    }

    console.log(`Car kilometers registered, transaction: ${signature}`);
    return `Car kilometers registered, transaction: ${signature}`;
  }

  /** Registers service attendance and mints an NFT */
  async registerServiceAttendance(vin: string, reportId: number, uri: string, serviceType: string): Promise<string> {
    console.log(`Registering service attendance for VIN: ${vin}, reportId: ${reportId}, serviceType: ${serviceType}, uri: ${uri}`);
    const carPda = await this.getCarPda(vin);
    const reportDataPda = await this.getReportDataPda(carPda, new anchor.BN(reportId));
    const ownerNft = await Keypair.generate();
    console.log(`Generated owner NFT keypair: ${ownerNft.publicKey.toBase58()}`);
    console.log(`Calling registerServiceAttendance with car PDA: ${carPda.toBase58()}, report data PDA: ${reportDataPda.toBase58()}`);

    // Define compute unit and priority fee instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000, // Standard for token transfers
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000, // 0.1 micro-lamports per compute unit
    });

    const tx = await this.program.methods
      .registerServiceAttendance(new anchor.BN(reportId), uri, serviceType)
      .accounts({
        car: carPda,
        reportData: reportDataPda,
        ownerNft: ownerNft.publicKey,
        creator: this.adminWalletKeypair.publicKey,
        owner: this.adminWalletKeypair.publicKey,
        mplTokenMetadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        systemProgram: SystemProgram.programId,
        mplCoreProgram: new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'),
      })
      .signers([ownerNft])
      .transaction();

    // Set blockhash and block height
    const { blockhash, lastValidBlockHeight } = await this.provider.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    // Add compute units and priority fee
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair, ownerNft], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed to register service attendance for VIN: ${vin}, reportId: ${reportId}, serviceType: ${serviceType}, uri: ${uri}`);
    }

    console.log(`Service attendance registered and NFT minted, transaction: ${signature}`);
    return `Service attendance registered and NFT minted, transaction: ${signature}`;
  }

  /** Retrieves a car report and mints an NFT */
  async getReport(vin: string, reportId: number, contentUri: string, reportType: string): Promise<string> {
    console.log(`Retrieving car report for VIN: ${vin}, reportId: ${reportId}, reportType: ${reportType}, contentUri: ${contentUri}`);
    const carPda = await this.getCarPda(vin);
    const dealerReportDataPda = await this.getDealerReportDataPda(carPda, new anchor.BN(reportId));
    const configPda = await this.getConfigPda();
    const ownerNft = await Keypair.generate();
    console.log(`Generated owner NFT keypair: ${ownerNft.publicKey.toBase58()}`);
    console.log(`Calling getReport with car PDA: ${carPda.toBase58()}, dealer report data PDA: ${dealerReportDataPda.toBase58()}, config PDA: ${configPda.toBase58()}`);

    // Define compute unit and priority fee instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000, // Standard for token transfers
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000, // 0.1 micro-lamports per compute unit
    });

    const tx = await this.program.methods
      .getReport(new anchor.BN(reportId), contentUri, reportType)
      .accounts({
        car: carPda,
        dealerReportData: dealerReportDataPda,
        config: configPda,
        ownerNft: ownerNft.publicKey,
        creator: this.adminWalletKeypair.publicKey,
        user: this.adminWalletKeypair.publicKey,
        vault: new PublicKey('3Qc5TBFKHSbEKxD81e5Pcczdg8Y5goFHga6HJdKgRis5'), //admin wallet pub key
        mplTokenMetadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        mplCoreProgram: new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'),
        systemProgram: SystemProgram.programId,
      })
      .signers([ownerNft])
      .transaction();

    // Set blockhash and block height
    const { blockhash, lastValidBlockHeight } = await this.provider.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    // Add compute units and priority fee
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair, ownerNft], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed retrieving car report for VIN: ${vin}, reportId: ${reportId}, reportType: ${reportType}, contentUri: ${contentUri}`);
    }

    console.log(`Car report retrieved and NFT minted, transaction: ${signature}`);
    return `Car report retrieved and NFT minted, transaction: ${signature}`;
  }

  /** Reports an error for a car */
  async reportCarError(vin: string, errorCode: number, errorMessage: string): Promise<string> {
    console.log(`Reporting car error for VIN: ${vin}, errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
    const carPda = await this.getCarPda(vin);
    console.log(`Calling reportCarError with car PDA: ${carPda.toBase58()}`);
    // Define compute unit and priority fee instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000, // Standard for token transfers
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000, // 0.1 micro-lamports per compute unit
    });

    const tx = await this.program.methods
      .reportCarError(errorCode, errorMessage)
      .accounts({
        car: carPda,
      })
      .transaction();

    // Set blockhash and block height
    const { blockhash, lastValidBlockHeight } = await this.provider.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    // Add compute units and priority fee
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed reporting car error for VIN: ${vin}, errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
    }

    console.log(`Car error reported, transaction: ${signature}`);
    return `Car error reported, transaction: ${signature}`;
  }

  /** Adds points to the user account */
  async addUserPoints(points: number): Promise<string> {
    console.log(`Adding user points: ${points}`);
    const configPda = await this.getConfigPda();
    const userPda = await this.getUserPda();
    console.log(`Calling addUserPoints with config PDA: ${configPda.toBase58()}, user PDA: ${userPda.toBase58()}`);
    
    // Define compute unit and priority fee instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000, // Standard for token transfers
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000, // 0.1 micro-lamports per compute unit
    });

    const tx = await this.program.methods
      .addUserPoints(new anchor.BN(points))
      .accounts({
        config: configPda,
        user: userPda,
        admin: this.adminWalletKeypair.publicKey,
      })
      .transaction();

    // Set blockhash and block height
    const { blockhash, lastValidBlockHeight } = await this.provider.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    // Add compute units and priority fee
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    // Send and confirm transaction
    const signature = await this.provider.sendAndConfirm(tx, [this.adminWalletKeypair], {
      commitment: 'confirmed',
      maxRetries: 3,
    });

    if (!signature) {
      throw new InternalServerErrorException(`Failed adding user points: ${points}`);
    }

    console.log(`User points added, transaction: ${signature}`);
    return `User points added, transaction: ${signature}`;
  }

  getTelemetry(id: string, from?: string, to?: string) {
    // TODO: fetch telemetry
    return { data: [] };
  }

  getBlockchain(id: string, limit: number) {
    // TODO: fetch on‐chain txs + chart
    return { transactions: [], chart: { data: [] } };
  }
}
